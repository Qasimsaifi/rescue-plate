import {
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import FoodCard from "../components/ui/card";
import { Colors } from "../constants/Colors";
import useLocation from "../hooks/useLocation";
import { getAllFoods } from "../lib/appwriteService";
import { databases } from "@/lib/appwrite";
export default function HomeScreen() {
  const { longitude, latitude, address, errorMessage } = useLocation();
  const [foods, setFoods] = React.useState([]);
  const { userDetails, logout } = useUser();
  const colorScheme = useColorScheme();
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        let res = await getAllFoods();
        setFoods(res);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods(); // Call the inner function
  }, []);
  return (
    <SafeAreaView className="flex-1">
      {/* <ScrollView> */}
      {userDetails ? (
        <View className="flex-1">
          <View className="relative">
            <Image
              className="w-full h-20 opacity-80"
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
              {foods.map((food, index) => (
                <View key={index} className="basis-1/2 p-1">
                  <FoodCard
                    title={food.name}
                    content={food.description}
                    price={food.price}
                    id={food.$id}
                    image={food.foodImage}
                  />
                </View>
              ))}
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
