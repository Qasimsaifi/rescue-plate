import { Client, Account, Databases, Storage } from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66fcb502000fbd3bb26e")
  .setPlatform("com.cariur.rescue-plate");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client); // Add this line to instantiate Storage

export { client, account, databases, storage }; // Export storage along with other modules
