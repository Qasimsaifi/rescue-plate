import {
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
} from "react-native";
import React from "react";
import { useUser } from "../context/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import FoodCard from "../components/ui/card";
import { Colors } from "../constants/Colors";

export default function HomeScreen() {
  const { userDetails, logout } = useUser();
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView className="flex-1">
      {/* <ScrollView> */}
      {userDetails ? (
        <View className="flex-1">
          <View className="relative">
            <Image
              className="w-full h-20 opacity-60"
              source={{
                uri: "https://images.pexels.com/photos/1391487/pexels-photo-1391487.jpeg",
              }}
            />
            <View className="absolute top-3 left-0 right-0 flex-row justify-between items-center p-4">
              <View className="flex-1">
                <View className="flex-row items-center ">
                  <Ionicons
                    name="location"
                    size={20}
                    color={Colors[colorScheme].text}
                    className="mr-4"
                  />
                  <Text
                    className=" text-xl font-bold ml-1"
                    style={{
                      color: Colors[colorScheme].text,
                    }}
                  >
                    New York City
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center mt-">
                <Ionicons
                  name="notifications-circle-outline"
                  size={42}
                  color={Colors[colorScheme].text}
                  style={{ marginHorizontal: 8 }}
                />
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={38}
                  color={Colors[colorScheme].text}
                  style={{ marginHorizontal: 8 }}
                />
              </View>
            </View>
          </View>
          <ScrollView>
            <View className="flex flex-wrap flex-row justify-between mt-4">
              <View className="basis-1/2 p-1">
                <FoodCard
                  title="Delicious Pizza"
                  content="A tasty pizza topped with mozzarella, pepperoni, and fresh herbs."
                  price="Free"
                  rating="4.5"
                />
              </View>
              <View className="basis-1/2 p-1">
                <FoodCard
                  title="Classic Burger"
                  content="A juicy burger with fresh lettuce, tomatoes, and cheddar cheese."
                  price="Free"
                  rating="4.7"
                />
              </View>
              <View className="basis-1/2 p-1">
                <FoodCard
                  title="Cheesy Pasta"
                  content="Creamy pasta with a mix of cheddar, mozzarella, and parmesan."
                  price="Free"
                  rating="4.6"
                />
              </View>
              <View className="basis-1/2 p-1">
                <FoodCard
                  title="Spicy Tacos"
                  content="Crispy tacos filled with seasoned beef, fresh salsa, and cheese."
                  price="Free"
                  rating="4.3"
                />
              </View>
              <View className="basis-1/2 p-1">
                <FoodCard
                  title="Spicy Tacos"
                  content="Crispy tacos filled with seasoned beef, fresh salsa, and cheese."
                  price="Free"
                  rating="4.3"
                />
              </View>
              <View className="basis-1/2 p-1">
                <FoodCard
                  title="Spicy Tacos"
                  content="Crispy tacos filled with seasoned beef, fresh salsa, and cheese."
                  price="Free"
                  rating="4.3"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
