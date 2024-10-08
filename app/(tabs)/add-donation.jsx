import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUser } from "../../context/UserContext";
import FoodDonationForm from "../../screens/FoodDonationForm";
import { ScrollView } from "react-native";

export default function add_donation() {
  const { userDetails, logout } = useUser();
  return (
    <ScrollView style={{ marginTop: 28 }}>
      <FoodDonationForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
//   style={{
//     marginTop: 180,
//     marginBottom: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     display: "flex",
//   }}
// >
//   <Button title="Logout" onPress={logout} />
{
  /* <View>
    </View> */
}
