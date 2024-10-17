import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  checkRequestStatus,
  createRequest,
  acceptRequest,
  rejectRequest,
} from "../lib/appwriteService";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const RequestButton = ({ userId, foodId }) => {
  const colorScheme = useColorScheme();
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const request = await checkRequestStatus(userId, foodId);
        setRequestStatus(request);
      } catch (error) {
        console.error("Error fetching request status:", error);
      }
    };

    fetchRequestStatus();
  }, [userId, foodId]);

  const handleRequest = async () => {
    try {
      if (requestStatus) {
        if (requestStatus.status === "pending") {
          await acceptRequest(requestStatus.$id);
          setRequestStatus({ ...requestStatus, status: "accepted" });
        } else {
          await rejectRequest(requestStatus.$id);
          setRequestStatus(null);
        }
      } else {
        const newRequest = await createRequest(userId, foodId);
        setRequestStatus(newRequest);
      }
    } catch (error) {
      console.error("Error handling request:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleRequest}
      className="py-3 px-4 rounded-lg flex-1 "
      style={{ backgroundColor: Colors[colorScheme].primary }}
    >
      <Text
        className="font-semibold text-center"
        style={{ color: Colors[colorScheme].text }}
      >
        {requestStatus
          ? requestStatus.status === "pending"
            ? "Cancel Request"
            : `Status: ${requestStatus.status}`
          : "Request"}
      </Text>
    </TouchableOpacity>
  );
};

export default RequestButton;
