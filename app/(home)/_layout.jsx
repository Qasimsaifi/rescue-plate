import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Slot, Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen name="register" /> */}
    </Stack>
  );
}
