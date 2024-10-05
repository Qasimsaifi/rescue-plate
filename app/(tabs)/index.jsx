import { View, ActivityIndicator } from "react-native";
import { useUser } from "../../context/UserContext";
import HomeScreen from "../../screens/HomeScreen";
import { Redirect } from "expo-router";

export default function Index() {
  return <HomeScreen />;
}
