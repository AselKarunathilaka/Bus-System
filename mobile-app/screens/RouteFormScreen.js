import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const RouteFormScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);
  const editingRoute = route.params?.routeData;

  const [routeName, setRouteName] = useState(editingRoute?.routeName || "");
  const [startLocation, setStartLocation] = useState(editingRoute?.startLocation || "");
  const [endLocation, setEndLocation] = useState(editingRoute?.endLocation || "");
  const [price, setPrice] = useState(editingRoute ? String(editingRoute.price) : "");
  const [distanceKm, setDistanceKm] = useState(editingRoute?.distanceKm !== undefined ? String(editingRoute.distanceKm) : "");
  const [estimatedDuration, setEstimatedDuration] = useState(editingRoute?.estimatedDuration || "");
  const [description, setDescription] = useState(editingRoute?.description || "");
  const [status, setStatus] = useState(editingRoute?.status || "active");

  const validateForm = () => {
    if (
      !routeName.trim() ||
      !startLocation.trim() ||
      !endLocation.trim() ||
      !price.trim() ||
      !distanceKm.trim() ||
      !estimatedDuration.trim()
    ) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return false;
    }

    if (Number(price) < 0) {
      Alert.alert("Validation Error", "Price must be 0 or greater");
      return false;
    }

    if (Number(distanceKm) <= 0) {
      Alert.alert("Validation Error", "Distance must be greater than 0");
      return false;
    }

    if (!["active", "inactive"].includes(status.toLowerCase().trim())) {
      Alert.alert("Validation Error", "Status must be active or inactive");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      routeName: routeName.trim(),
      startLocation: startLocation.trim(),
      endLocation: endLocation.trim(),
      price: Number(price),
      distanceKm: Number(distanceKm),
      estimatedDuration: estimatedDuration.trim(),
      description: description.trim(),
      status: status.toLowerCase().trim(),
    };

    try {
      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Route updated successfully");
      } else {
        await api.post("/routes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Route created successfully");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save route"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{editingRoute ? "Edit Route" : "Add Route"}</Text>

      <TextInput style={styles.input} placeholder="Route Name" value={routeName} onChangeText={setRouteName} />
      <TextInput style={styles.input} placeholder="Start Location" value={startLocation} onChangeText={setStartLocation} />
      <TextInput style={styles.input} placeholder="End Location" value={endLocation} onChangeText={setEndLocation} />
      <TextInput style={styles.input} placeholder="Price (LKR)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Distance in KM" value={distanceKm} onChangeText={setDistanceKm} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Estimated Duration (e.g. 3h 30m)" value={estimatedDuration} onChangeText={setEstimatedDuration} />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput style={styles.input} placeholder="Status (active/inactive)" value={status} onChangeText={setStatus} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{editingRoute ? "Update Route" : "Create Route"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RouteFormScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});