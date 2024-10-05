import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { toast } from "../lib/toast";
import { router } from "expo-router";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // For additional user details
  const [isLoaded, setIsLoaded] = useState(false); // Track if the user check is complete

  async function login(email, password) {
    const loggedIn = await account.createEmailPasswordSession(email, password);
    setUser(loggedIn);
    await fetchUserDetails();
    // toast("Welcome back. You are logged in");
    router.replace("(tabs)/"); // Redirect to Home or any other screen after login
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    setUserDetails(null);
    toast("Logged out");
    router.replace("/auth/login"); // Redirect to Login after logout
  }

  async function register(email, password, name) {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
    toast("Account created");
    router.replace("(tabs)/"); // Redirect to Home after registration
  }

  async function fetchUserDetails() {
    try {
      const userDetails = await account.get();
      setUserDetails(userDetails);
    } catch (err) {
      setUserDetails(null);
    }
  }

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
      await fetchUserDetails();
      // toast("Welcome back. You are logged in");
      router.replace("(tabs)/"); // Optionally redirect if user is already logged in
    } catch (err) {
      setUser(null);
      setUserDetails(null);
    } finally {
      setIsLoaded(true); // Set isLoaded to true when the check is complete
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        current: user,
        userDetails,
        isLoaded, // Expose the isLoaded state
        login,
        logout,
        register,
        toast,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
