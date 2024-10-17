import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  getUserFoodRequests,
  acceptRequest,
  rejectRequest,
} from "../lib/appwriteService";
import { useUser } from "../context/UserContext";
import {
  Check,
  X,
  Trash2,
  Bell,
  RefreshCw,
  Clock,
  User,
} from "lucide-react-native";
import { Colors } from "../constants/Colors";
import { useColorScheme } from "react-native";

const NotificationsScreen = () => {
  const colorScheme = useColorScheme();
  const { userDetails } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const fetchedRequests = await getUserFoodRequests(userDetails.$id);
      setRequests(fetchedRequests);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await acceptRequest(requestId);
      fetchRequests();
      Alert.alert("Success", "Request accepted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to accept request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
      fetchRequests();
      Alert.alert("Success", "Request rejected successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to reject request");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "accepted":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const renderRequest = ({ item }) => (
    <View
      className={`m-2 p-4 rounded-lg ${colorScheme === "dark" ? "bg-gray-800" : "bg-gray-100"} shadow-xl`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text
          className={`font-bold text-lg ${colorScheme === "dark" ? "text-white" : "text-black"}`}
        >
          {item.foodName}
        </Text>
        <Text className={`font-semibold ${getStatusColor(item.status)}`}>
          {item.status}
        </Text>
      </View>

      <View className="flex-row items-center mb-4">
        <Clock size={16} color={Colors[colorScheme].text} />
        <Text style={{ color: Colors[colorScheme].text }} className="ml-2">
          {new Date(item.$createdAt).toLocaleString()}
        </Text>
      </View>
      <View className="flex-row justify-end space-x-2">
        {item.status === "pending" && (
          <>
            <TouchableOpacity
              onPress={() => handleAccept(item.$id)}
              className="bg-green-500 p-2 rounded-full"
            >
              <Check color="white" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleReject(item.$id)}
              className="bg-red-500 p-2 rounded-full"
            >
              <X color="white" size={20} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: Colors[colorScheme].background }}
      >
        <ActivityIndicator size={60} color={Colors[colorScheme].text} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        className="flex-1 justify-center items-center p-4"
        style={{ backgroundColor: Colors[colorScheme].background }}
      >
        <Text className="text-red-500 text-lg mb-4 text-center">{error}</Text>
        <TouchableOpacity
          onPress={fetchRequests}
          className="flex-row items-center bg-blue-500 px-6 py-3 rounded-full"
        >
          <RefreshCw color="white" size={20} />
          <Text className="text-white ml-2 font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors[colorScheme].background }}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {requests.length > 0 ? (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.$id}
          contentContainerClassName="pb-4"
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Bell color={Colors[colorScheme].text} size={64} />
          <Text
            style={{ color: Colors[colorScheme].text }}
            className="mt-4 text-lg text-center"
          >
            No notifications at the moment.
            {"\n"}
            We'll notify you when there's any activity!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;
