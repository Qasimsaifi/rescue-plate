import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Colors } from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "expo-router";
import FollowButton from "@/components/FollowButton";
import {
  createRequest,
  getFoodWithRequests,
  getUser,
  toggleFollow,
  checkRequestStatus,
  acceptRequest,
  rejectRequest,
} from "@/lib/appwriteService";
import haversineDistance from "../lib/lib";
import useLocation from "@/hooks/useLocation";
import { useUser } from "@/context/UserContext";
import RequestButton from "@/components/RequestButton";
const SingleFoodView = ({ id }) => {
  const { userDetails } = useUser();
  const colorScheme = useColorScheme();
  const [food, setFood] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const { longitude, latitude } = useLocation();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await getFoodWithRequests(id);
        const userDet = await getUser(res.userId);
        const status = await checkRequestStatus(userDetails.$id, id);
        setRequestStatus(status);
        const foodLatitude = parseFloat(res.latitude);
        const foodLongitude = parseFloat(res.longitude);

        if (
          !isNaN(foodLatitude) &&
          !isNaN(foodLongitude) &&
          latitude &&
          longitude
        ) {
          const distance = haversineDistance(
            foodLatitude,
            foodLongitude,
            latitude,
            longitude,
          );
          setFood({
            title: res.name,
            $id: res.$id,
            price: res.price,
            description: res.description,
            userId: res.userId,
            imageUrl: res.foodImage,
            ownerLocation: {
              latitude: foodLatitude,
              longitude: foodLongitude,
            },
            distance: distance,
            contact: res.phone,
            quantity: res.quantity,
            expirationDate: res.expiry,
            pickupTime: res.pickup,
          });
        }
      } catch (error) {
        console.error("Error fetching food:", error);
      }
    };

    fetchFood();
  }, [id, latitude, longitude]);
  if (!food) {
    return (
      <View className="flex-1 justify-center items-center mt-[100%]">
        <ActivityIndicator size="large" color={Colors[colorScheme].text} />
      </View>
    );
  }

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const timeFormatted = `${hours}:${minutes}`;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;

    return { timeFormatted, dateFormatted };
  };

  async function handleFollow() {
    await toggleFollow(userDetails.$id, food.userId);
  }
  const {
    timeFormatted: pickupTimeFormatted,
    dateFormatted: pickupDateFormatted,
  } = formatDateTime(food.pickupTime);
  const {
    timeFormatted: expirationTimeFormatted,
    dateFormatted: expirationDateFormatted,
  } = formatDateTime(food.expirationDate);
  return (
    <ScrollView className="p-3">
      <Image
        source={{ uri: food.imageUrl }}
        className="w-full h-[250px] rounded-lg mb-[18px]"
        resizeMode="cover"
      />

      <View className="mb-2">
        <Text
          className="text-[22px] font-bold"
          style={{ color: Colors[colorScheme].text }}
        >
          {food.title}
        </Text>
        <Text className="text-lg text-green-500">{food.price}</Text>
      </View>

      <View className="">
        <Text className="mb-1" style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Quantity: </Text>
          {food.quantity}
        </Text>
        <Text className="mb-1" style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Expires on: </Text>
          {expirationDateFormatted}
        </Text>
        <Text className="mb-1" style={{ color: Colors[colorScheme].text }}>
          <Text className="font-semibold">Pickup Time: </Text>
          {pickupDateFormatted} at {pickupTimeFormatted}
        </Text>
        <Text style={{ color: Colors[colorScheme].text }}>
          {food.contact && (
            <Text className="font-semibold">Contact: {food.contact} </Text>
          )}
        </Text>
      </View>

      <Text className="py-2" style={{ color: Colors[colorScheme].text }}>
        {requestStatus && `Request Status: ${requestStatus.status}`}
      </Text>
      <View className="flex-row justify-between mb-4">
        <RequestButton userId={userDetails.$id} foodId={food.$id} />
      </View>

      <Text className="mb-4" style={{ color: Colors[colorScheme].text }}>
        {food.description}
      </Text>
      <Text style={{ color: Colors[colorScheme].text }}>
        <Text className="font-semibold">Distance: </Text>
        {food.distance}
      </Text>

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
