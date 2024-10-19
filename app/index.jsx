import { View, Text, ActivityIndicator } from "react-native";
import { useUser } from "../context/UserContext";
import { Redirect, SplashScreen } from "expo-router";
// SplashScreen.preventAutoHideAsync();
const Index = () => {
  const { userDetails, isLoaded } = useUser();
  if (userDetails) {
    return <Redirect href="/home" />;
  } else if (isLoaded) {
    return <Redirect href="/auth/login" />;
  }
  return <ActivityIndicator></ActivityIndicator>;
};

export default Index;
