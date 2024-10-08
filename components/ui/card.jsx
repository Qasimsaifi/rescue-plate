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

const FoodCard = ({ title, price, image, id }) => {
  const navigation = useNavigation();
  function onCardPress() {
    console.log(id);
    router.navigate(`/(home)/details/${id}`);
  }
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
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-green-600 font-semibold">{price}</Text>
          <TouchableOpacity
            onPress={onCardPress}
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
