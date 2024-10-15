import React from "react";
import {
  Image,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useUser } from "../context/UserContext";
import { Colors } from "../constants/Colors";
import {
  Package,
  TreeDeciduous,
  Users,
  Settings,
  LogOut,
  Edit,
} from "lucide-react-native";
import { router } from "expo-router";

const defUserImage = require("../assets/images/def-user.png");
export default function ProfileScreen() {
  const { userDetails, logout, updatePrefs, userPrefs, updateUser } = useUser();
  const colorScheme = useColorScheme();
  const handlePrefs = () => {
    updatePrefs({
      ...userPrefs,
      profilePicture:
        "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=1587",
    });
  };

  console.log(userDetails);
  const textColor = { color: Colors[colorScheme].text };
  const primaryColor = Colors[colorScheme].primary;

  return (
    <ScrollView className="">
      <View className="items-center pt-10 ">
        <Image
          source={
            userPrefs?.profilePicture
              ? {
                  uri: userPrefs?.profilePicture,
                }
              : defUserImage
          }
          className="w-32 h-32 rounded-full"
        />

        <Text style={textColor} className="text-2xl font-bold mt-4">
          {userDetails.name}
        </Text>
        <Text></Text>
      </View>

      <View className="flex-row justify-around py-6 ">
        <View className="items-center">
          <Text style={textColor} className="text-2xl font-semibold">
            52
          </Text>
          <Text style={{ ...textColor }} className="text-sm mt-1">
            Donations
          </Text>
        </View>
        <View className="items-center">
          <Text style={textColor} className="text-2xl font-semibold">
            215K
          </Text>
          <Text style={{ ...textColor }} className="text-sm mt-1">
            Followers
          </Text>
        </View>
        <View className="items-center">
          <Text style={textColor} className="text-2xl font-semibold">
            80
          </Text>
          <Text style={{ ...textColor }} className="text-sm mt-1">
            Following
          </Text>
        </View>
      </View>

      <View className="px-8 py-14">
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => router.push("/screens")}
        >
          <Package color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            My Donations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={handlePrefs}
        >
          <Edit color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mb-6">
          <Settings color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center" onPress={logout}>
          <LogOut color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
