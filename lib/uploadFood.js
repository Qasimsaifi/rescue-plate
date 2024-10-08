import { databases, storage } from "./appwrite";
import { ID } from "react-native-appwrite";

const databaseId = "67036e10001a99029e38";
const collectionId = "67036e2500111d34d89c";
const bucketId = "670374430009df86ecdd";
const projectId = "66fcb502000fbd3bb26e";

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
      pickedImage
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
      }
    );

    return response;
  } catch (error) {
    console.error("Failed to upload food:", error);
    throw error;
  }
};
