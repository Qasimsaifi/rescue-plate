import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../context/UserContext";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { Camera } from "lucide-react-native";
import { uploadImage } from "../lib/appwriteService";

export default function EditProfile({ currentUser, onSubmit }) {
  const { userDetails, userPrefs, updateUser, updatePrefs } = useUser();
  const colorScheme = useColorScheme();
  const [name, setName] = useState(currentUser.name);
  const [image, setImage] = useState(userPrefs?.profilePicture);
  const [imageUpload, setUploadImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        setErrors({
          ...errors,
          image: "Permission to access media library is required!",
        });
        return;
      }

      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      };

      let response = await ImagePicker.launchImageLibraryAsync(options);
      if (!response.canceled) {
        setUploadImage(response.assets[0]);
        setImage(response.assets[0].uri);
        setErrors({ ...errors, image: null });
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      setErrors({
        ...errors,
        image: "Failed to pick image. Please try again.",
      });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (name && !name.trim()) {
      newErrors.name = "Name cannot be empty";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        if (imageUpload) {
          const res = await uploadImage(imageUpload);
          if (res && res.url) {
            await updatePrefs({ profilePicture: res.url });
          } else {
            throw new Error("Failed to upload image");
          }
        }

        if (name && name !== currentUser.name) {
          await updateUser({ name: name });
        }

        Alert.alert("Success", "Profile updated successfully");
        if (onSubmit) onSubmit();
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert(
        "Update Failed",
        error.message || "An error occurred while updating your profile",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="items-center mb-8">
        <TouchableOpacity onPress={pickImage} className="relative">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-40 h-40 rounded-full border-4 border-blue-500"
            />
          ) : (
            <View className="w-40 h-40 rounded-full bg-gray-300 justify-center items-center">
              <Camera size={48} color={Colors[colorScheme].text} />
            </View>
          )}
          <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
            <Camera size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text className="mt-4 text-blue-600 font-semibold">
          Change Profile Picture
        </Text>
        {errors.image && (
          <Text className="text-red-500 mt-1">{errors.image}</Text>
        )}
      </View>

      <View className="space-y-6">
        <View>
          <Text
            className="mb-2 font-medium"
            style={{ color: Colors[colorScheme].text }}
          >
            Name
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4"
            style={{ color: Colors[colorScheme].text }}
            value={name}
            onChangeText={setName}
            placeholderTextColor={
              colorScheme === "light" ? "#6B7280" : "#9CA3AF"
            }
            placeholder="Enter your name"
          />
          {errors.name && (
            <Text className="text-red-500 mt-1">{errors.name}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        className="mt-8 rounded-lg p-4 items-center"
        onPress={handleSubmit}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#ccc" : Colors[colorScheme].primary,
        }}
      >
        <Text className="text-white font-bold text-lg">
          {isLoading ? "Updating..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
