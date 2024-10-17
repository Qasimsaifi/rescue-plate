import { account, databases, storage } from "./appwrite";
import { Query, ID } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
const FOOD_COLLECTION_ID = process.env.EXPO_PUBLIC_FOOD_COLLECTION_ID;
const REQUESTS_COLLECTION_ID = process.env.EXPO_PUBLIC_REQUESTS_COLLECTION_ID;
const FOLLOWERS_COLLECTION_ID = process.env.EXPO_PUBLIC_FOLLOWERS_COLLECTION_ID;
const BUCKET_ID = process.env.EXPO_PUBLIC_STORAGE_BUCKET_ID;

export const createRequest = async (userId, foodId) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      "unique()",
      {
        userId,
        status: "pending",
        foodId,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserFoodRequests = async (userId) => {
  try {
    const userFoods = await databases.listDocuments(
      DATABASE_ID,
      FOOD_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );

    const foodIds = userFoods.documents.map((food) => food.$id);

    const requests = await databases.listDocuments(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      [
        Query.equal("foodId", foodIds),
        Query.notEqual("status", "rejected"),
        Query.orderDesc("$createdAt"),
      ],
    );

    const enrichedRequests = await Promise.all(
      requests.documents.map(async (request) => {
        const foodDetails = userFoods.documents.find(
          (food) => food.$id === request.foodId,
        );
        return {
          ...request,
          foodName: foodDetails?.name || "Unknown Food",
          foodImage: foodDetails?.image || null,
        };
      }),
    );

    return enrichedRequests;
  } catch (error) {
    console.error("Error fetching user food requests:", error);
    throw error;
  }
};

export const acceptRequest = async (requestId) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      requestId,
      {
        status: "accepted",
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      requestId,
      {
        status: "rejected",
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkRequestStatus = async (userId, foodId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("foodId", foodId)],
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }

    return null;
  } catch (error) {
    console.error("Error checking request status:", error);
    throw error;
  }
};

export const getFoodWithRequests = async (foodId) => {
  try {
    const foodItem = await databases.getDocument(
      DATABASE_ID,
      FOOD_COLLECTION_ID,
      foodId,
    );

    const requests = await databases.listDocuments(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      [Query.equal("foodId", foodId)],
    );

    foodItem.requests = requests.documents;

    return foodItem;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const user = await account.get(userId);
    return user;
  } catch (error) {
    throw error;
  }
};
export const getFoodsByUserId = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      FOOD_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching food items by userId:", error);
    throw error;
  }
};
export const getAllFoods = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      FOOD_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.orderAsc("name")],
    );
    return response.documents;
  } catch (error) {
    throw error;
  }
};

export const followUser = async (followerId, followingId) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      "unique()",
      {
        followerId,
        followingId,
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (followerId, followingId) => {
  try {
    const followingDocument = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
      ],
    );

    if (followingDocument.documents.length > 0) {
      const response = await databases.deleteDocument(
        DATABASE_ID,
        FOLLOWERS_COLLECTION_ID,
        followingDocument.documents[0].$id,
      );
      return response;
    } else {
      throw new Error("Following record not found.");
    }
  } catch (error) {
    throw error;
  }
};

export const getFollowers = async (userId) => {
  try {
    const followers = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [Query.equal("followingId", userId)],
    );

    return followers.documents;
  } catch (error) {
    throw error;
  }
};

export const getFollowing = async (userId) => {
  try {
    const following = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [Query.equal("followerId", userId)],
    );

    return following.documents;
  } catch (error) {
    throw error;
  }
};

// Check if the user is following another user
export const isFollowing = async (followerId, followedId) => {
  try {
    // Check if both IDs are valid before running the query
    if (!followerId || !followedId) {
      throw new Error("Invalid followerId or followedId.");
    }

    // Query to check if the followerId and followedId match an existing document
    const result = await databases.listDocuments(
      DATABASE_ID,
      FOLLOWERS_COLLECTION_ID,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followedId),
      ],
    );

    // If any document is found, the user is following
    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw error;
  }
};
// Toggle follow/unfollow functionality
export const toggleFollow = async (followerId, followingId) => {
  try {
    const isUserFollowing = await isFollowing(followerId, followingId);
    if (isUserFollowing) {
      await unfollowUser(followerId, followingId);
    } else {
      await followUser(followerId, followingId);
    }
    return !isUserFollowing;
  } catch (error) {
    throw error;
  }
};

export const deleteFood = async (foodId) => {
  try {
    const response = await databases.deleteDocument(
      DATABASE_ID,
      FOOD_COLLECTION_ID,
      foodId,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (pickedFile) => {
  try {
    const imageToUpload = {
      name: pickedFile.fileName || `image_${Date.now()}.jpg`,
      type: pickedFile.mimeType,
      uri: pickedFile.uri,
      size: pickedFile.fileSize,
    };
    console.log(imageToUpload);
    console.log(BUCKET_ID);
    const imageResponse = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      imageToUpload,
    );
    // console.log(imageResponse);
    return {
      url: `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${imageResponse.$id}/view?project=${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteRequest = async (requestId) => {
  try {
    const response = await databases.deleteDocument(
      DATABASE_ID,
      REQUESTS_COLLECTION_ID,
      requestId,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
