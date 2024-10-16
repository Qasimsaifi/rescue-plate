import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
  Alert,
} from "react-native";
import { getFoodsByUserId, deleteFood } from "../lib/appwriteService";
import { useUser } from "../context/UserContext";
import UserFoodCard from "../components/ui/userFoodCard";
import { Colors } from "../constants/Colors";

const YourDonations = () => {
  const { userDetails } = useUser();
  const colorScheme = useColorScheme();
  const [donations, setDonations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const fetchedDonations = await getFoodsByUserId(userDetails.$id);
        setDonations(fetchedDonations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [userDetails.$id]);

  const handleDeleteFood = async (foodId) => {
    Alert.alert(
      "Delete Food",
      "Are you sure you want to delete this food donation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFood(foodId);
              const updatedDonations = donations.filter(
                (food) => food.$id !== foodId,
              );
              setDonations(updatedDonations);
            } catch (error) {
              console.error("Error deleting food:", error);
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex items-center justify-center h-full">
      {isLoading ? (
        <ActivityIndicator size={60} color={Colors[colorScheme].text} />
      ) : (
        donations && (
          <ScrollView>
            <View className="flex flex-wrap flex-row justify-between mt-4">
              {donations.map((food, index) => (
                <View key={index} className="basis-1/2 p-1">
                  <UserFoodCard
                    title={food.name}
                    content={food.description}
                    date={food.$createdAt}
                    id={food.$id}
                    image={food.foodImage}
                    onDelete={() => handleDeleteFood(food.$id)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )
      )}
    </View>
  );
};

export default YourDonations;
