import { Slot, Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Appearance, useColorScheme } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  let colorScheme = useColorScheme();
  useEffect(() => {
    const getThemeFromStorage = async () => {
      try {
        const theme = await AsyncStorage.getItem("theme");
        if (theme) {
          Appearance.setColorScheme(theme);
          colorScheme = theme;
        }
      } catch (error) {
        console.error("Error getting theme from storage:", error);
      }
    };
    getThemeFromStorage();
  }, []);
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  );
}
