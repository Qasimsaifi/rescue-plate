import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Colors } from "../../constants/Colors";

const FoodCard = ({ title, price, onCardPress, onButtonPress }) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onCardPress}
      activeOpacity={0.7}
      className="p-2 m-1 rounded-lg shadow-lg bg-black"
      style={{
        backgroundColor: Colors[colorScheme].tab,
      }}
    >
      <Image
        source={{
          uri: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
        }}
        className="w-full h-40 rounded-lg mb-3"
        resizeMode="cover"
      />
      <View className="px-1">
        <Text
          style={{
            color: Colors[colorScheme].text,
          }}
          className=" text-lg font-bold mb-1"
        >
          {title}
        </Text>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-green-600 font-semibold">{price}</Text>
          <TouchableOpacity
            onPress={onButtonPress}
            activeOpacity={0.7}
            className="px-6 rounded-lg py-1 mt-2"
            style={{
              backgroundColor: Colors[colorScheme].primary,
            }}
          >
            <Text className="font-semibold">Get</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCard;
