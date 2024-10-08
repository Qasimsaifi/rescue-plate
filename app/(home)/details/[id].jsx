import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import SingleFoodView from "../../../screens/SingleFoodView";
import { useLocalSearchParams, useNavigation } from "expo-router";

const SingleFoodPage = () => {
  const { id } = useLocalSearchParams();
  // console.log("from page ", id);
  return (
    <View
      style={{
        paddingVertical: 30,
      }}
    >
      <SingleFoodView id={id} />
    </View>
  );
};

export default SingleFoodPage;
