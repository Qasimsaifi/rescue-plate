import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import useLocation from "../hooks/useLocation";
import { Colors } from "../constants/Colors";
import { uploadFood } from "../lib/uploadFood";
import { useUser } from "../context/UserContext";

const FoodDonationForm = () => {
  // State variables
  const { userDetails } = useUser();
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("Free");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [foodType, setFoodType] = useState("Fruits");
  const [allergens, setAllergens] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [foodImage, setFoodImage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const colorScheme = useColorScheme();
  const { longitude, latitude, address, errorMessage } = useLocation();

  useEffect(() => {
    Geocoder.init("AIzaSyAsWQMDga09hKix9MVOAYtjuzW0mdSwSIs");

    if (latitude && longitude) {
      setSelectedLocation({ latitude, longitude });
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }

    if (errorMessage) {
      Alert.alert("Error", `Unable to fetch location: ${errorMessage}`);
    }
  }, [latitude, longitude, errorMessage]);

  const chooseImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("Permission to access media library is required!");
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    };

    try {
      let response = await ImagePicker.launchImageLibraryAsync(options);
      if (!response.canceled) {
        setFoodImage(response.assets[0]);
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
    }
  };

  const handleSubmit = async () => {
    if (
      !foodName ||
      !description ||
      !quantity ||
      !selectedLocation ||
      !userDetails
    ) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      const response = await uploadFood({
        name: foodName,
        price,
        description,
        quantity: parseInt(quantity),
        expiry: expirationDate,
        pickup: pickupTime,
        type: foodType,
        allergens,
        longitude: selectedLocation.longitude,
        latitude: selectedLocation.latitude,
        pickedFile: foodImage,
        userId: userDetails?.$id,
      });
      console.log("Form submitted successfully!", response);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate =
      selectedDate || (showDatePicker ? expirationDate : pickupTime);
    if (showDatePicker) {
      setExpirationDate(currentDate);
    } else {
      setPickupTime(currentDate);
    }
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const searchLocation = async () => {
    if (!searchQuery) {
      Alert.alert("Error", "Please enter a location to search.");
      return;
    }

    setIsSearching(true);
    try {
      const result = await Geocoder.from(searchQuery);
      const { lat, lng } = result.results[0].geometry.location;
      setSelectedLocation({ latitude: lat, longitude: lng });
      setInitialRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setSearchQuery("");
      setSuggestedLocations([]);
    } catch (error) {
      Alert.alert("Error", "Location not found: " + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchQueryChange = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      try {
        const result = await Geocoder.from(text);
        const suggestions = result.results.slice(0, 5).map((item) => ({
          description: item.formatted_address,
          placeId: item.place_id,
        }));
        setSuggestedLocations(suggestions);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestedLocations([]);
    }
  };

  const selectSuggestedLocation = async (description) => {
    setIsSearching(true);
    try {
      const result = await Geocoder.from(description);
      if (result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        setSelectedLocation({ latitude: lat, longitude: lng });
        setInitialRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
        setSearchQuery(description);
      } else {
        Alert.alert("Error", "Unable to find the selected location.");
      }
    } catch (error) {
      console.error("Error selecting suggested location:", error);
      Alert.alert("Error", "Failed to select the location. Please try again.");
    } finally {
      setIsSearching(false);
      setSuggestedLocations([]);
    }
  };

  const renderButton = (title, onPress, isLoading = false) => (
    <TouchableOpacity
      className=" p-3 rounded-lg mb-4"
      style={{ backgroundColor: Colors[colorScheme].primary }}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={Colors[colorScheme].primary} />
      ) : (
        <Text
          style={{ color: Colors[colorScheme].text }}
          className="text-center"
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 p-4 ">
      <Text
        className="text-3xl font-bold mb-6 text-center"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Donate Food
      </Text>
      {foodImage ? (
        <TouchableOpacity className="mb-4 w-96 h-96" onPress={chooseImage}>
          <Image
            source={{ uri: foodImage.uri }}
            className="w-full h-full rounded-lg"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ borderColor: Colors[colorScheme].text }}
          className="mb-4 w-full h-96 items-center justify-center border  rounded-lg"
          onPress={chooseImage}
        >
          <Text
            style={{
              color: Colors[colorScheme].text,
            }}
          >
            Select image
          </Text>
        </TouchableOpacity>
      )}
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Food Name:
      </Text>
      <TextInput
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
        className="border p-2 rounded-lg mb-4"
        value={foodName}
        onChangeText={setFoodName}
        placeholder="Enter Food Title"
      />
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Price:
      </Text>
      <View
        className="border p-2 rounded-lg mb-4"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        <Picker
          style={{
            borderColor: Colors[colorScheme].text,
            color: Colors[colorScheme].text,
          }}
          selectedValue={price}
          onValueChange={setPrice}
          className="text-lg"
        >
          <Picker.Item label="Free" value="Free" />
          <Picker.Item label="Suggested Donation" value="Suggested Donation" />
        </Picker>
      </View>
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Description:
      </Text>
      <TextInput
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
        className="border p-2 rounded-lg mb-4"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={10}
        textAlignVertical="top"
        placeholder="Enter Description"
      />
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Search Location:
      </Text>
      <TextInput
        style={{
          color: Colors[colorScheme].text,
          borderColor: Colors[colorScheme].text,
        }}
        className="border p-2 rounded-lg mb-2"
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
        placeholder="Enter location"
      />
      {suggestedLocations.map((location, index) => (
        <TouchableOpacity
          style={{
            borderColor: Colors[colorScheme].text,
            color: Colors[colorScheme].text,
          }}
          key={index}
          className="p-2 border "
          onPress={() => selectSuggestedLocation(location.description)}
        >
          <Text
            style={{
              borderColor: Colors[colorScheme].text,
              color: Colors[colorScheme].text,
            }}
          >
            {location.description}
          </Text>
        </TouchableOpacity>
      ))}
      <MapView
        className="w-full h-64 my-4 rounded-lg"
        initialRegion={initialRegion}
        region={
          selectedLocation
            ? {
                ...initialRegion,
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }
            : initialRegion
        }
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      {renderButton("Use Current Location", () => {
        setSearchQuery(address || "");
        setSelectedLocation({ latitude, longitude });
      })}
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Quantity:
      </Text>
      <TextInput
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
        className="border p-2 rounded-lg mb-4"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="Enter Quantity"
      />
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Food Type:
      </Text>
      <View
        className="border p-2 rounded-lg mb-4"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        <Picker
          selectedValue={foodType}
          onValueChange={setFoodType}
          style={{
            borderColor: Colors[colorScheme].text,
            color: Colors[colorScheme].text,
          }}
        >
          <Picker.Item label="Fruits" value="Fruits" />
          <Picker.Item label="Vegetables" value="Vegetables" />
          <Picker.Item label="Canned Goods" value="Canned Goods" />
        </Picker>
      </View>
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Allergens:
      </Text>
      <TextInput
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
        className="border p-2 rounded-lg mb-4"
        value={allergens}
        onChangeText={setAllergens}
        placeholder="Enter Allergens (optional)"
      />
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Select Expiration Date:
      </Text>
      {renderButton(`Expiry : ${expirationDate.toLocaleDateString()}`, () =>
        setShowDatePicker(true),
      )}
      {showDatePicker && (
        <DateTimePicker
          value={expirationDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text
        className="text-lg font-bold mb-2"
        style={{
          borderColor: Colors[colorScheme].text,
          color: Colors[colorScheme].text,
        }}
      >
        Select Pickup Time:
      </Text>
      {renderButton(`Pickup Time : ${pickupTime.toLocaleTimeString()}`, () =>
        setShowTimePicker(true),
      )}
      {showTimePicker && (
        <DateTimePicker
          value={pickupTime}
          mode="time"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {renderButton("Submit", handleSubmit)}
    </ScrollView>
  );
};

export default FoodDonationForm;
