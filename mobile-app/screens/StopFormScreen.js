import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const StopFormScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);
  const routeId = route.params?.routeId;
  const stopData = route.params?.stopData;

  const [stopName, setStopName] = useState(stopData?.stopName || "");
  const [location, setLocation] = useState(stopData?.location || "");
  const [order, setOrder] = useState(stopData ? String(stopData.order) : "");

  const validateForm = () => {
    if (!stopName.trim() || !location.trim() || !order.trim()) {
      Alert.alert("Validation Error", "Please fill all fields");
      return false;
    }

    if (Number(order) <= 0) {
      Alert.alert("Validation Error", "Order must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      stopName: stopName.trim(),
      location: location.trim(),
      order: Number(order),
      routeId,
    };

    try {
      if (stopData) {
        await api.put(`/stops/${stopData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Stop updated successfully");
      } else {
        await api.post("/stops", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Stop created successfully");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save stop"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{stopData ? "Edit Stop" : "Add Stop"}</Text>

      <TextInput style={styles.input} placeholder="Stop Name" value={stopName} onChangeText={setStopName} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Order" value={order} onChangeText={setOrder} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{stopData ? "Update Stop" : "Create Stop"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StopFormScreen;

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