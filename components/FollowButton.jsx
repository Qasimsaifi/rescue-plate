import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { isFollowing, toggleFollow } from "../lib/appwriteService";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const FollowButton = ({ followerId, followedId }) => {
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const following = await isFollowing(followerId, followedId);
        setIsUserFollowing(following);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [followerId, followedId]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const newFollowStatus = await toggleFollow(followerId, followedId);
      setIsUserFollowing(newFollowStatus);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="py-1 px-3 rounded-lg"
      onPress={handleFollow}
      style={{
        backgroundColor: isUserFollowing
          ? "transparent"
          : Colors[colorScheme].primary,

        borderWidth: 2,
        borderColor: Colors[colorScheme].primary,
        opacity: loading ? 0.2 : 1,
      }}
      disabled={loading}
    >
      <Text
        style={{
          color: isUserFollowing
            ? Colors[colorScheme].primary
            : Colors[colorScheme].text,
          fontWeight: "600",
        }}
      >
        {isUserFollowing ? "Unfollow" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
