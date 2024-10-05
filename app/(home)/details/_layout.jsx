import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, Slot, Stack } from "expo-router";

export default function DetailsLayout({ route }) {
  const routes = route;
  console.log(routes);
  //   const title = params?.id ? `Details for ${params.id}` : "No ID provided";
  return (
    <Stack
      screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}
    >
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      {/* <Stack.Screen name="register" /> */}
    </Stack>
  );
}
