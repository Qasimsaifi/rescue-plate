import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";

const SingleFoodView = () => {
  const colorScheme = useColorScheme();

  const food = {
    title: "Delicious Pizza",
    price: "Free",
    description:
      "A mouth-watering pizza loaded with cheese, pepperoni, and fresh vegetables.",
    imageUrl:
      "https://images.pexels.com/photos/28528516/pexels-photo-28528516/free-photo-of-delicious-slices-of-pizza-on-vibrant-background.jpeg",
    ownerName: "John Doe",
    ownerImage: "https://randomuser.me/api/portraits/men/32.jpg",
    ownerLocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    distance: "2.5 km",
    contact: "+1 234 567 890",
    quantity: "2 large pizzas",
    expirationDate: "Oct 10, 2024",
    pickupTime: "10 AM - 6 PM",
  };

  function handleRequest() {
    console.log("Request button pressed");
  }

  function handleMessage() {
    console.log("Message button pressed");
  }

  function handleFollow() {
    console.log("Follow button pressed");
  }

  return (
    <ScrollView
      className="p-3"
      style={{ backgroundColor: Colors[colorScheme].background }}
    >
      {/* Food Image */}
      <Image
        source={{ uri: food.imageUrl }}
        className="w-full h-[250px] rounded-lg mb-[18px]"
        resizeMode="cover"
      />

      {/* Owner Profile and Follow Button */}
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: food.ownerImage }}
          className="w-[50px] h-[50px] rounded-full mr-3"
        />
        <View className="flex-1">
          <Text
            className="text-base"
            style={{ color: Colors[colorScheme].text }}
          >
            By {food.ownerName}
          </Text>
          <Text
            className="text-xs opacity-60"
            style={{ color: Colors[colorScheme].text }}
          >
            Web Developer
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleFollow}
          className="py-2 px-4 rounded-lg"
          style={{ backgroundColor: Colors[colorScheme].primary }}
        >
          <Text
            className="font-semibold"
            style={{ color: Colors[colorScheme].buttonText }}
          >
            Follow
          </Text>
        </TouchableOpacity>
      </View>

      {/* Food Title and Price */}
      <View className="mb-2">
        <Text
          className="text-[22px] font-bold"
          style={{ color: Colors[colorScheme].text }}
        >
          {food.title}
        </Text>
        <Text className="text-lg text-green-500">{food.price}</Text>
      </View>

      {/* Additional Food Details */}
      <View className="mb-4">
        <Text className="mb-1" style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Quantity: </Text>
          {food.quantity}
        </Text>
        <Text className="mb-1" style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Expires on: </Text>
          {food.expirationDate}
        </Text>
        <Text className="mb-1" style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Pickup Time: </Text>
          {food.pickupTime}
        </Text>
        <Text style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Contact: </Text>
          {food.contact}
        </Text>
      </View>

      {/* Request and Message Buttons */}
      <View className="flex-row justify-between mb-8">
        <TouchableOpacity
          onPress={handleRequest}
          className="py-3 px-4 rounded-lg flex-1 mr-2"
          style={{ backgroundColor: Colors[colorScheme].primary }}
        >
          <Text
            className="font-semibold text-center"
            style={{ color: Colors[colorScheme].buttonText }}
          >
            Request
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMessage}
          className="py-3 px-4 rounded-lg flex-1 ml-2"
          style={{ backgroundColor: Colors[colorScheme].primary }}
        >
          <Text
            className="font-semibold text-center"
            style={{ color: Colors[colorScheme].buttonText }}
          >
            Message
          </Text>
        </TouchableOpacity>
      </View>

      {/* Description and Distance */}
      <Text className="mb-4" style={{ color: Colors[colorScheme].text }}>
        {food.description}
      </Text>
      <Text style={{ color: Colors[colorScheme].text }}>
        <Text className="font-semibold">Distance: </Text>
        {food.distance}
      </Text>

      {/* Map View */}
      <View className="mt-4 mb-0.5">
        <MapView
          initialRegion={{
            latitude: food.ownerLocation.latitude,
            longitude: food.ownerLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          className="w-full h-[400px] rounded-lg"
        >
          <Marker
            coordinate={{
              latitude: food.ownerLocation.latitude,
              longitude: food.ownerLocation.longitude,
            }}
            title="Food Location"
            description={`${food.title} is available here`}
          />
        </MapView>
      </View>
    </ScrollView>
  );
};

export default SingleFoodView;
