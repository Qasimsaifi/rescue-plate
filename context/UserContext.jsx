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
  const [userDetails, setUserDetails] = useState(null);
  const [userPrefs, setUserPrefs] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  async function login(email, password) {
    const loggedIn = await account.createEmailPasswordSession(email, password);
    setUser(loggedIn);
    await fetchUserDetails();
    await fetchUserPrefs();
    router.replace("(tabs)/");
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    setUserDetails(null);
    setUserPrefs(null);
    toast("Logged out");
    router.replace("/auth/login");
  }

  async function register(email, password, name) {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
    toast("Account created");
    router.replace("(tabs)/");
  }

  async function fetchUserDetails() {
    try {
      const details = await account.get();
      setUserDetails(details);
    } catch (err) {
      setUserDetails(null);
    }
  }

  async function fetchUserPrefs() {
    try {
      const prefs = await account.getPrefs();
      setUserPrefs(prefs);
      console.log(prefs);
    } catch (err) {
      setUserPrefs(null);
    }
  }

  async function updateUser(updates) {
    try {
      const updatedUser = await account.updateName(updates.name);
      setUserDetails(updatedUser);

      toast("User details updated");
    } catch (err) {
      toast("Failed to update user details");
    }
  }

  async function updatePrefs(newPrefs) {
    try {
      // Merge new preferences with existing ones
      // const updatedPrefs = { newPrefs };
      const result = await account.updatePrefs(newPrefs);
      setUserPrefs(result);
      toast("Preferences updated");
    } catch (err) {
      toast("Failed to update preferences");
    }
  }

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
      await fetchUserDetails();
      await fetchUserPrefs();
      // router.replace("(tabs)/");
    } catch (err) {
      setUser(null);
      setUserDetails(null);
      setUserPrefs(null);
    } finally {
      setIsLoaded(true);
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
        userPrefs,
        isLoaded,
        login,
        logout,
        register,
        updateUser,
        updatePrefs,
        toast,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
