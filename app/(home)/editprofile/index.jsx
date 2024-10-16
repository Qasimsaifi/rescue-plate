import React from "react";
import { StyleSheet, View } from "react-native";
import EditProfile from "../../../screens/EditProfile";
import { useUser } from "../../../context/UserContext";

export default function App() {
  const { userDetails } = useUser();
  return (
    <EditProfile
      currentUser={userDetails}
      onSubmit={() => console.log("form")}
    />
  );
}
