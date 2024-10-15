import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { router, useNavigation } from "expo-router";

const UserFoodCard = ({ title, date, image, id }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="p-2 m-1 rounded-lg shadow-lg bg-black"
      style={{
        backgroundColor: Colors[colorScheme].tab,
      }}
    >
      <Image
        source={{
          uri: image,
        }}
        className="w-full h-40 rounded-lg mb-3"
        resizeMode="cover"
      />
      <View className="px-1">
        <Text
          style={{
            color: Colors[colorScheme].text,
          }}
          className=" text-base font-bold mb-1"
        >
          {title}
        </Text>
        <View className="flex-row justify-between items-center mb-2 ">
          <Text className="text-green-600 font-medium text-xs">
            {new Date(date).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="px-4 rounded-lg py-1 mt-2"
            style={{
              backgroundColor: "red",
            }}
          >
            <Text className="font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserFoodCard;
