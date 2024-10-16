import React from "react";
import {
  Image,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useUser } from "../context/UserContext";
import { Colors } from "../constants/Colors";
import {
  Package,
  TreeDeciduous,
  Users,
  Settings,
  LogOut,
  Edit,
} from "lucide-react-native";
import { router } from "expo-router";
import { useEffect } from "react";
import { useState } from "react";
import { getFoodsByUserId } from "../lib/appwriteService";

const defUserImage = require("../assets/images/def-user.png");
export default function ProfileScreen() {
  const { userDetails, logout, updatePrefs, userPrefs, updateUser } = useUser();
  const [profilePic, setProfilePic] = useState("");
  const [donationsCount, setDonationsCount] = useState(0);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setProfilePic(userDetails?.prefs.profilePicture);

    const fetchDonations = async () => {
      try {
        const fetchedDonations = await getFoodsByUserId(userDetails.$id);
        setDonationsCount(fetchedDonations.length);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [updatePrefs]);
  console.log(userDetails);
  const textColor = { color: Colors[colorScheme].text };
  const primaryColor = Colors[colorScheme].primary;

  return (
    <ScrollView className="">
      <View className="items-center pt-10 ">
        <View
          className=" border rounded-full "
          style={{ borderColor: Colors[colorScheme].text }}
        >
          <Image
            source={
              userDetails?.prefs.profilePicture
                ? {
                    uri: profilePic,
                  }
                : {
                    uri: "https://th.bing.com/th/id/OIP.GbeZQdeiXR0SA9h-4Ez6zgHaQD?rs=1&pid=ImgDetMain",
                  }
            }
            className="w-32 h-32 rounded-full "
          />
        </View>

        <Text style={textColor} className="text-2xl font-bold mt-4">
          {userDetails.name}
        </Text>
        <Text></Text>
      </View>

      <View className="flex-row justify-around py-6 ">
        <View className="items-center">
          <Text style={textColor} className="text-2xl font-semibold">
            {donationsCount}
          </Text>
          <Text style={{ ...textColor }} className="text-sm mt-1">
            Total Donations
          </Text>
        </View>
      </View>

      <View className="px-8 py-14">
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => router.push("/(home)/yourdonations")}
        >
          <Package color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            My Donations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => router.push("/(home)/editprofile")}
        >
          <Edit color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => router.push("/(home)/setting")}
        >
          <Settings color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center" onPress={logout}>
          <LogOut color={primaryColor} size={24} />
          <Text style={textColor} className="text-lg ml-4">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
