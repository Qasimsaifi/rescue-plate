import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { Link } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
export default function LoginScreen() {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await user.login(email, password);
      setErrorMessage(null);
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header_text, themeTextStyle]}>
        Login to your account.
      </Text>
      <Text style={[styles.para, themeTextStyle]}>
        Please sign in to your account{" "}
      </Text>
      {errorMessage && (
        <Text style={[themeTextStyle, { color: "red", paddingVertical: 8 }]}>
          {errorMessage}
        </Text>
      )}
      <Text style={[styles.label, themeTextStyle]}>Email Address</Text>
      <TextInput
        style={[styles.input, themeTextStyle]}
        placeholder="Enter your email address"
        value={email}
        placeholderTextColor={colorScheme === "light" ? "black" : "white"}
        onChangeText={setEmail}
      />
      <Text style={[styles.label, themeTextStyle]}>Password</Text>
      <TextInput
        style={[styles.input, themeTextStyle]}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colorScheme === "light" ? "black" : "white"}
        secureTextEntry
      />
      <Text style={[styles.forgor_text]}>Forgot password?</Text>

      <TouchableOpacity
        disabled={isLoading}
        onPress={handleLogin}
        style={styles.btn}
      >
        {isLoading ? (
          <ActivityIndicator
            style={styles.btn_loader}
            size={40}
            color={"#ffffff"}
          />
        ) : (
          <Text style={styles.btn_text}>Sign in</Text>
        )}
      </TouchableOpacity>
      <Text style={[styles.signup_text, themeTextStyle]}>
        Don't have an account?{" "}
        <Link href="/auth/register" style={styles.signup_link}>
          Register
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 26,
  },
  header_text: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  input: {
    height: 60,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    color: "black",
    paddingLeft: 18,
  },
  para: {
    marginBottom: 40,
    opacity: 0.6,
  },
  label: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#FE8C00",
    borderRadius: 100,
  },
  btn_text: {
    textAlign: "center",
    padding: 20,

    color: Colors.dark.text,
    fontWeight: "bold",
  },
  btn_loader: {
    padding: 10,
    color: "white",
  },
  forgor_text: {
    color: "#FE8C00",
    textAlign: "right",
    marginBottom: 20,
  },
  signup_text: {
    marginTop: 30,
    textAlign: "center",
  },
  signup_link: {
    color: "#FE8C00",
    fontWeight: "medium",
  },
  error_message: {
    color: "red",
    marginBottom: 10,
  },
});
