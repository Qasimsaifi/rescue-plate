import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Slot, Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <Stack
      screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
