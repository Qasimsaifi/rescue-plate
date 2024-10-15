import { Tabs, Slot, Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ tabBarActiveTintColor: "blue", headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Your Donations",
          headerTitleAlign: "center",
        }}
      />
      {/* <Stack.Screen name="register" /> */}
    </Stack>
  );
}
