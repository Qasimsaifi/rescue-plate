import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Switch } from "react-native";
import { useColorScheme, Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Moon,
  Sun,
  MessageSquare,
  FileText,
  UserCircle,
  Trash,
  LogOut,
  Lock,
} from "lucide-react-native";
import { Colors } from "../constants/Colors";
import { useUser } from "../context/UserContext";
import { router } from "expo-router";

const SettingScreen = () => {
  const colorScheme = useColorScheme();
  const { userDetails, logout } = useUser();
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    colorScheme === "dark",
  );

  const toggleDarkMode = async () => {
    const newColorScheme = darkModeEnabled ? "light" : "dark";
    Appearance.setColorScheme(newColorScheme);
    await AsyncStorage.setItem("theme", newColorScheme);
    setDarkModeEnabled(!darkModeEnabled);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme) {
          setDarkModeEnabled(storedTheme === "dark");
        }
      } catch (error) {
        console.error("Error loading theme from AsyncStorage:", error);
      }
    };
    loadTheme();
  }, []);

  const SettingItem = ({ icon, text, onPress, toggle }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: Colors[colorScheme].tab }}
      className="flex flex-row items-center justify-between  rounded-xl p-4 mb-4 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <View className="flex flex-row items-center">
        {icon}
        <Text
          className=" font-medium ml-3"
          style={{ color: Colors[colorScheme].text }}
        >
          {text}
        </Text>
      </View>
      {toggle && (
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={Colors[colorScheme].text}
          onValueChange={toggleDarkMode}
          value={darkModeEnabled}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-6 justify-center ">
      <SettingItem
        icon={
          darkModeEnabled ? (
            <Moon className="text-yellow-400" size={24} />
          ) : (
            <Sun className="text-yellow-500" size={24} />
          )
        }
        text="Dark Mode"
        onPress={toggleDarkMode}
        toggle={true}
      />
      <View className="space-y-4">
        <SettingItem
          icon={<MessageSquare className="text-blue-500" size={24} />}
          text="Feedback and Support"
          onPress={() => {}}
        />
        <SettingItem
          icon={<FileText className="text-green-500" size={24} />}
          text="Terms & Conditions / Privacy Policy"
          onPress={() => {}}
        />
        <SettingItem
          icon={<UserCircle className="text-purple-500" size={24} />}
          text="Edit Profile"
          onPress={() => router.push("/(home)/editprofile")}
        />
        <SettingItem
          icon={<LogOut className="text-red-500" size={24} />}
          text="Logout"
          onPress={logout}
        />
      </View>
    </View>
  );
};

export default SettingScreen;
