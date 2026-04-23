import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../services/api";

export default function BusFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const bus = route.params?.bus;

  const [busName, setBusName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [busType, setBusType] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [driverName, setDriverName] = useState("");
  const [conductorName, setConductorName] = useState("");
  const [status, setStatus] = useState("Available");
  const [assignedRoute, setAssignedRoute] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bus) {
      setBusName(bus.busName || "");
      setLicenseNumber(bus.licenseNumber || "");
      setBusType(bus.busType || "");
      setTotalSeats(bus.totalSeats ? String(bus.totalSeats) : "");
      setDriverName(bus.driverName || "");
      setConductorName(bus.conductorName || "");
      setStatus(bus.status || "Available");
      setAssignedRoute(
        typeof bus.assignedRoute === "object"
          ? bus.assignedRoute?._id || ""
          : bus.assignedRoute || ""
      );
    }
  }, [bus]);

  const handleSubmit = async () => {
    if (
      !busName ||
      !licenseNumber ||
      !busType ||
      !totalSeats ||
      !driverName ||
      !conductorName
    ) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    const payload = {
      busName,
      licenseNumber,
      busType,
      totalSeats: Number(totalSeats),
      driverName,
      conductorName,
      status,
      assignedRoute: assignedRoute || null,
    };

    try {
      setLoading(true);

      if (bus?._id) {
        await api.put(`/buses/${bus._id}`, payload);
        Alert.alert("Success", "Bus updated successfully");
      } else {
        await api.post("/buses", payload);
        Alert.alert("Success", "Bus created successfully");
      }

      navigation.goBack();
    } catch (error) {
      console.log("Save bus error:", error?.response?.data || error.message);
      Alert.alert("Error", error?.response?.data?.message || "Failed to save bus");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{bus ? "Update Bus" : "Add New Bus"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Bus Name"
        value={busName}
        onChangeText={setBusName}
      />

      <TextInput
        style={styles.input}
        placeholder="License Number"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Bus Type"
        value={busType}
        onChangeText={setBusType}
      />

      <TextInput
        style={styles.input}
        placeholder="Total Seats"
        value={totalSeats}
        onChangeText={setTotalSeats}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Driver Name"
        value={driverName}
        onChangeText={setDriverName}
      />

      <TextInput
        style={styles.input}
        placeholder="Conductor Name"
        value={conductorName}
        onChangeText={setConductorName}
      />

      <TextInput
        style={styles.input}
        placeholder="Status (Available / Assigned / Unavailable)"
        value={status}
        onChangeText={setStatus}
      />

      <TextInput
        style={styles.input}
        placeholder="Assigned Route ID (optional)"
        value={assignedRoute}
        onChangeText={setAssignedRoute}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Please wait..." : bus ? "Update Bus" : "Create Bus"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8fafc",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e293b",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  button: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});