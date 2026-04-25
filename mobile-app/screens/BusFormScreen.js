import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../services/api";

export default function BusFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const bus = route.params?.busData || null;

  const [busName, setBusName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [busType, setBusType] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [driverName, setDriverName] = useState("");
  const [conductorName, setConductorName] = useState("");
  const [status, setStatus] = useState("Available");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bus) {
      setBusName(bus.busName || "");
      setLicenseNumber(bus.licenseNumber || "");
      setBusType(bus.busType || "");
      setTotalSeats(String(bus.totalSeats || ""));
      setDriverName(bus.driverName || "");
      setConductorName(bus.conductorName || "");
      setStatus(bus.status || "Available");
    }
  }, [bus]);

  const handleSubmit = async () => {
    if (
      !busName.trim() ||
      !licenseNumber.trim() ||
      !busType.trim() ||
      !totalSeats.trim() ||
      !driverName.trim() ||
      !conductorName.trim()
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const payload = {
      busName: busName.trim(),
      licenseNumber: licenseNumber.trim(),
      busType: busType.trim(),
      totalSeats: Number(totalSeats),
      driverName: driverName.trim(),
      conductorName: conductorName.trim(),
      status: status.trim() || "Available",
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

      navigation.navigate("BusList");
    } catch (error) {
      console.log("Bus save error:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save bus"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{bus ? "Update Bus" : "Add New Bus"}</Text>

      <TextInput style={styles.input} placeholder="Bus Name" value={busName} onChangeText={setBusName} />
      <TextInput style={styles.input} placeholder="License Number" value={licenseNumber} onChangeText={setLicenseNumber} />
      <TextInput style={styles.input} placeholder="Bus Type" value={busType} onChangeText={setBusType} />
      <TextInput style={styles.input} placeholder="Total Seats" value={totalSeats} onChangeText={setTotalSeats} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Driver Name" value={driverName} onChangeText={setDriverName} />
      <TextInput style={styles.input} placeholder="Conductor Name" value={conductorName} onChangeText={setConductorName} />
      <TextInput style={styles.input} placeholder="Status" value={status} onChangeText={setStatus} />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : bus ? "Update Bus" : "Create Bus"}
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
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: "#0f172a",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
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
    fontWeight: "800",
    fontSize: 16,
  },
});