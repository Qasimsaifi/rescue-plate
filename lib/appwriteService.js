import { account, databases } from "./appwrite"; // Import from appwrite.js
import { Query } from "react-native-appwrite"; // Make sure to import Query

// Define Constants for Database and Collection IDs
const DATABASE_ID = "67036e10001a99029e38"; // Replace with your database ID
const FOOD_COLLECTION_ID = "67036e2500111d34d89c"; // Replace with your food collection ID
const REQUESTS_COLLECTION_ID = "6705588700122358bf53"; // Replace with your requests collection ID
const FOLLOWERS_COLLECTION_ID = "6704aae400014cc91977"; // Replace with your followers collection ID

// Create a request
export const createRequest = async (userId, foodId) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      "unique()", // Auto-generate a unique ID
      {
        userId: userId,
        status: "pending",
        foodId: foodId, // Associate with food item
        timestamp: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
};

// Accept a request
export const acceptRequest = async (requestId) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      requestId, // The ID of the request to accept
      {
        status: "accepted",
      }
    );
    return response;
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

// Reject a request
export const rejectRequest = async (requestId) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      requestId, // The ID of the request to reject
      {
        status: "rejected",
      }
    );
    return response;
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw error;
  }
};

// Retrieve a food item with its requests
export const getFoodWithRequests = async (foodId) => {
  try {
    // Get the food item
    const foodItem = await databases.getDocument(
      DATABASE_ID,
      FOOD_COLLECTION_ID,
      foodId
    );

    // Fetch requests associated with this food item
    const requests = await databases.listDocuments(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      [Query.equal("foodId", foodId)] // Query to get all requests for this food item
    );

    // Add requests to the food item
    foodItem.requests = requests.documents; // Assuming you want to attach all requests

    return foodItem;
  } catch (error) {
    console.error("Error fetching food item with requests:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const user = await account.get(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Additional function to get all food items (if needed)
export const getAllFoods = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      FOOD_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching all food items:", error);
    throw error;
  }
};

// Follow a user
export const followUser = async (followerId, followedId) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      "unique()", // Auto-generate a unique ID
      {
        followerId: followerId,
        followedId: followedId,
        timestamp: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (followerId, followedId) => {
  try {
    // Find the document to delete
    const followingDocument = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [
        Query.equal("followerId", followerId),
        Query.equal("followedId", followedId),
      ]
    );

    if (followingDocument.documents.length > 0) {
      const response = await databases.deleteDocument(
        DATABASE_ID,
        FOLLOWERS_COLLECTION_ID,
        followingDocument.documents[0].$id // Delete the found document
      );
      return response;
    } else {
      throw new Error("Following record not found.");
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};

// Get followers of a user
export const getFollowers = async (userId) => {
  try {
    const followers = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [Query.equal("followedId", userId)] // Get all followers for the specified user
    );

    return followers.documents;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
};

// Get following of a user
export const getFollowing = async (userId) => {
  try {
    const following = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [Query.equal("followerId", userId)] // Get all users that the specified user is following
    );

    return following.documents;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw error;
  }
};
