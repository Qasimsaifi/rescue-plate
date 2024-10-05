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
import Checkbox from "expo-checkbox";
import { toast } from "@/lib/toast";
export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const user = useUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast(
        "Incomplete Information",
        "Please fill in all the required fields."
      );
      return;
    }
    if (!isChecked) {
      toast(
        "Terms and Conditions",
        "You must agree to the terms and conditions to register."
      );
      return;
    }
    setIsLoading(true);
    try {
      await user.register(email, password, name);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={[styles.header_text, themeTextStyle]}>
        Create your new account
      </Text>
      <Text style={[styles.para, themeTextStyle]}>
        Create an account to start looking for the food you like
      </Text>
      <Text style={[styles.label, themeTextStyle]}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={colorScheme === "light" ? "black" : "white"}
      />
      <Text style={[styles.label, themeTextStyle]}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={colorScheme === "light" ? "black" : "white"}
      />
      <Text style={[styles.label, themeTextStyle]}>Password</Text>
      <TextInput
        textContentType="password"
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        placeholderTextColor={colorScheme === "light" ? "black" : "white"}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.policy_agree_container}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "#FE8C00" : undefined}
        />
        <Text
          onPress={() => setChecked(!isChecked)}
          style={[styles.policy_agree_text, themeTextStyle]}
        >
          I Agree with{" "}
          <Link href={"/"} style={styles.link}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href={"/"} style={styles.link}>
            Privacy Policy
          </Link>
        </Text>
      </View>
      <TouchableOpacity
        disabled={isLoading}
        onPress={handleRegister}
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
        Allready have an account?{" "}
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 26,
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  header_text: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 60,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
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
    marginTop: 30,
  },
  btn_text: {
    padding: 20,
    textAlign: "center",
    // color: "white",
    fontWeight: "bold",
  },
  btn_loader: {
    padding: 10,
    // color: "white",
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

  link: {
    color: "#FE8C00",
    fontWeight: "medium",
  },
  policy_agree_text: {
    paddingRight: 30,
    paddingLeft: 10,
  },
  policy_agree_container: {
    flexDirection: "row",
    // alignItems: "center",
  },
  checkbox: {
    margin: 4,
  },
});
