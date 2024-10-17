import {
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useUser } from "../context/UserContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import FoodCard from "../components/ui/card";
import { Colors } from "../constants/Colors";
import useLocation from "../hooks/useLocation";
import { Bell, MapPin, MessageCircle, Settings } from "lucide-react-native";
import { getAllFoods } from "../lib/appwriteService";
import { databases } from "@/lib/appwrite";
const defUserImage = require("../assets/images/homecover.jpg");
import { Link, router } from "expo-router";
export default function HomeScreen() {
  const { longitude, latitude, address, errorMessage } = useLocation();
  const [foods, setFoods] = React.useState([]);
  const { userDetails, logout } = useUser();
  const colorScheme = useColorScheme();
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        let res = await getAllFoods(userDetails.$id);
        setFoods(res);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);
  return (
    <View className="flex-1">
      {userDetails ? (
        <View className="flex-1">
          <View className="relative">
            <Image
              className="w-full opacity-60"
              style={{ height: 70 }}
              source={defUserImage}
            />
            <View className="absolute top-3 left-0 right-0 flex-row justify-between items-center p-4">
              <View className="flex-1">
                <View className="flex-row items-center ">
                  <MapPin
                    size={20}
                    color={Colors[colorScheme].text}
                    className="mr-1"
                  />
                  <Text
                    className=" text-xl font-medium"
                    style={{
                      color: Colors[colorScheme].text,
                    }}
                  >
                    {address[0]?.city}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center mt-">
                <TouchableOpacity
                  onPress={() => router.push("/(home)/notifications")}
                >
                  <Bell
                    name="chatbubble-ellipses-outline"
                    size={32}
                    color={Colors[colorScheme].text}
                    style={{ marginHorizontal: 8 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView>
            <View className="flex flex-wrap flex-row justify-between my-4">
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
        <ActivityIndicator size="large" color="red" />
      )}
    </View>
  );
}
