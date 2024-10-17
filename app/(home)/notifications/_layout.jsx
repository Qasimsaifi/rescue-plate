import { Tabs, Slot, Stack } from "expo-router";

export default function NotificationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="register" /> */}
    </Stack>
  );
}
