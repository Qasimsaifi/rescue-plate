import { View, Text } from "react-native";
import React from "react";
import SingleFoodView from "../../../screens/SingleFoodView";
import { useLocalSearchParams } from "expo-router";

const SingleFoodPage = () => {
  const { id } = useLocalSearchParams();
  return (
    <View
      style={{
        paddingVertical: 30,
      }}
    >
      <SingleFoodView id />
    </View>
  );
};

export default SingleFoodPage;
