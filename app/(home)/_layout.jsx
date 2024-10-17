import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Slot, Stack } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="yourdonations"
        options={{
          title: "Your Donations",
          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          title: "Setting",

          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="editprofile"
        options={{
          title: "Edit Profile",

          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",

          headerTitleAlign: "center",
          headerShown: true,
        }}
      />
      {/* <Stack.Screen name="register" /> */}
    </Stack>
  );
}
