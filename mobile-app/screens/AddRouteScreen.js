import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../services/api";

const AddRouteScreen = ({ navigation }) => {
  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");

  const handleCreateRoute = async () => {
    if (!routeName || !startLocation || !endLocation || !price) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await api.post("/routes", {
        routeName,
        startLocation,
        endLocation,
        price: Number(price),
        status,
      });

      Alert.alert("Success", "Route created successfully");
      navigation.goBack();
    } catch (error) {
      console.log("Create route error:", error?.response?.data || error.message);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create route"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Route</Text>

      <TextInput
        style={styles.input}
        placeholder="Route Name"
        value={routeName}
        onChangeText={setRouteName}
      />

      <TextInput
        style={styles.input}
        placeholder="Start Location"
        value={startLocation}
        onChangeText={setStartLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="End Location"
        value={endLocation}
        onChangeText={setEndLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Status (active/inactive)"
        value={status}
        onChangeText={setStatus}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateRoute}>
        <Text style={styles.buttonText}>Create Route</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddRouteScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});