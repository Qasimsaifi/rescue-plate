import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
const useLocation = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [address, setAddress] = useState("");
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMessage("Permission to access location was denied");
      return;
    }
    let { coords } = await Location.getCurrentPositionAsync({});
    if (coords) {
      const { latitude, longitude } = coords;
      console.log("user long lat b", latitude, longitude);
      setLatitude(latitude);
      setLongitude(longitude);
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      //   console.log("User location is ", response);
      setAddress(response);
    }
  };
  useEffect(() => {
    getLocation();
  }, []);
  return { longitude, latitude, errorMessage, address };
};

export default useLocation;
