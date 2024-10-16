import { databases, storage } from "./appwrite";
import { ID } from "react-native-appwrite";

const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID;
const collectionId = process.env.EXPO_PUBLIC_FOOD_COLLECTION_ID;
const bucketId = process.env.EXPO_PUBLIC_STORAGE_BUCKET_ID;
const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

export const uploadFood = async ({
  name,
  price,
  description,
  quantity,
  expiry,
  pickup,
  type,
  allergens,
  longitude,
  latitude,
  pickedFile,
  userId,
}) => {
  try {
    const pickedImage = {
      name: pickedFile.fileName,
      type: pickedFile.mimeType,
      uri: pickedFile.uri,
      size: pickedFile.fileSize,
    };

    const imageResponse = await storage.createFile(
      bucketId,
      ID.unique(),
      pickedImage,
    );

    const foodImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageResponse.$id}/view?project=${projectId}&mode=admin`;

    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        name,
        price,
        description,
        quantity,
        expiry,
        pickup,
        type,
        allergens,
        longitude,
        latitude,
        foodImage: foodImageUrl,
        userId,
      },
    );

    return response;
  } catch (error) {
    console.error("Failed to upload food:", error);
    throw error;
  }
};
