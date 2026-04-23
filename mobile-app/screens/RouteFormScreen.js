import React, { useContext, useState } from "react";
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
import { AuthContext } from "../context/AuthContext";

const RouteFormScreen = ({ route, navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const editingRoute = route.params?.routeData;

  const [routeName, setRouteName] = useState(editingRoute?.routeName || "");
  const [startLocation, setStartLocation] = useState(editingRoute?.startLocation || "");
  const [endLocation, setEndLocation] = useState(editingRoute?.endLocation || "");
  const [price, setPrice] = useState(
    editingRoute?.price !== undefined ? String(editingRoute.price) : ""
  );
  const [distanceKm, setDistanceKm] = useState(
    editingRoute?.distanceKm !== undefined ? String(editingRoute.distanceKm) : ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    editingRoute?.estimatedDuration || ""
  );
  const [description, setDescription] = useState(editingRoute?.description || "");
  const [status, setStatus] = useState(editingRoute?.status || "active");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Route updated successfully");
      } else {
        await api.post("/routes", payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Route created successfully");
      }

      navigation.goBack();
    } catch (error) {
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
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {editingRoute ? "Edit Route" : "Add Route"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Route Name"
          value={routeName}
          onChangeText={setRouteName}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Start Location"
          value={startLocation}
          onChangeText={setStartLocation}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="End Location"
          value={endLocation}
          onChangeText={setEndLocation}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Price (LKR)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Distance in KM"
          value={distanceKm}
          onChangeText={setDistanceKm}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Estimated Duration (e.g. 3h 30m)"
          value={estimatedDuration}
          onChangeText={setEstimatedDuration}
          returnKeyType="next"
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <TextInput
          style={styles.input}
          placeholder="Status (active/inactive)"
          value={status}
          onChangeText={setStatus}
          autoCapitalize="none"
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
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

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RouteFormScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120,
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
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});