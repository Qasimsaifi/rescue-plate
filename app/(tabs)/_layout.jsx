import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { useUser } from "../../context/UserContext";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { CircleFadingPlus, House, Search, User } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoaded, current } = useUser();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={Colors[colorScheme].text} />
      </View>
    );
  }

  if (!current) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <>
      <Tabs
        className="mb-20"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].primary,
          tabBarInactiveTintColor: Colors[colorScheme].text,
          headerShown: false,
          tabBarStyle: {
            height: "8%",
            backgroundColor: Colors[colorScheme].tab,

            borderTopLeftRadius: 40,
            borderColor: Colors[colorScheme].tab,
            borderTopRightRadius: 40,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <House size={28} color={color} />,
          }}
        />

        <Tabs.Screen
          name="add-donation"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <CircleFadingPlus size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            tabBarIcon: ({ color }) => (
              <User size={34} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
