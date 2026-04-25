import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import api from "../services/api";

const RouteFormScreen = ({ route, navigation }) => {
  const editingRoute = route?.params?.routeData;

  const [routeName, setRouteName] = useState(editingRoute?.routeName || "");
  const [startLocation, setStartLocation] = useState(editingRoute?.startLocation || "");
  const [endLocation, setEndLocation] = useState(editingRoute?.endLocation || "");
  const [price, setPrice] = useState(
    editingRoute?.price ? String(editingRoute.price) : ""
  );
  const [distanceKm, setDistanceKm] = useState(
    editingRoute?.distanceKm ? String(editingRoute.distanceKm) : ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    editingRoute?.estimatedDuration || ""
  );
  const [description, setDescription] = useState(editingRoute?.description || "");
  const [status, setStatus] = useState(editingRoute?.status || "active");
  const [loading, setLoading] = useState(false);

  // ======================
  // VALIDATION
  // ======================
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

  // ======================
  // SUBMIT FUNCTION
  // ======================
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
      setLoading(true);

      if (editingRoute && editingRoute._id) {
        await api.put(`/routes/${editingRoute._id}`, payload);
        Alert.alert("Success", "Route updated successfully");
      } else {
        await api.post("/routes", payload);
        Alert.alert("Success", "Route created successfully");
      }

      navigation.goBack();
    } catch (error) {
      console.log("Route error:", error?.response?.data || error.message);

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save route"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {editingRoute ? "Edit Route" : "Add Route"}
        </Text>

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
          placeholder="Price (LKR)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Distance in KM"
          value={distanceKm}
          onChangeText={setDistanceKm}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Estimated Duration (e.g. 3h 30m)"
          value={estimatedDuration}
          onChangeText={setEstimatedDuration}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Status (active/inactive)"
          value={status}
          onChangeText={setStatus}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? editingRoute
                ? "Updating..."
                : "Creating..."
              : editingRoute
              ? "Update Route"
              : "Create Route"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RouteFormScreen;

// ======================
// STYLES
// ======================
const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
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
    fontWeight: "bold",
  },
});