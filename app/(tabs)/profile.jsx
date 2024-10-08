import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUser } from "../../context/UserContext";
import ProfileScreen from "../../screens/ProfileScreen";
import { SafeAreaView } from "react-native-safe-area-context";
export default function profile() {
  return (
    <SafeAreaView>
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
