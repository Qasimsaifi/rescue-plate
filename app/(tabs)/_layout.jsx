import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Slot, Tabs } from "expo-router";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { useUser } from "../../context/UserContext"; // Import the UserContext
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router"; // Import Redirect to manage navigation
import * as SplashScreen from "expo-splash-screen";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoaded, current } = useUser(); // Destructure isLoaded and current from the context

  if (!isLoaded) {
    // Show loader while checking authentication status
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={60} color={Colors[colorScheme].text} />
      </View>
    );
  }

  if (!current) {
    // Redirect to login if not authenticated
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
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={34} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={34} name="search" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-donation"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={34} name="plus" color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="setting"
          options={{
            title: "Setting",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={34} name="cog" color={color} />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={34} name="user" color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
        name="register"
        options={{
          title: "register",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
        /> */}
      </Tabs>
    </>
  );
}
