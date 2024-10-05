import { Client, Account } from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66fcb502000fbd3bb26e")
  .setPlatform("com.cariur.rescue-plate");

const account = new Account(client);

export { client, account };
