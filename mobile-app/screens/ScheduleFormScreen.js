import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ScheduleFormScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);
  const existingSchedule = route.params?.schedule;

  const [routeId, setRouteId] = useState(existingSchedule?.routeId?._id || "");
  const [busId, setBusId] = useState(existingSchedule?.busId?._id || "");
  // Quick format for date handling
  const [departureDate, setDepartureDate] = useState(
    existingSchedule ? new Date(existingSchedule.departureDate).toISOString().split("T")[0] : ""
  );
  const [departureTime, setDepartureTime] = useState(existingSchedule?.departureTime || "");
  const [arrivalTime, setArrivalTime] = useState(existingSchedule?.arrivalTime || "");
  const [status, setStatus] = useState(existingSchedule?.status || "Scheduled");

  const [routesList, setRoutesList] = useState([]);
  const [busesList, setBusesList] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [routesRes, busesRes] = await Promise.all([
          api.get("/routes", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/buses", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setRoutesList(routesRes.data);
        setBusesList(busesRes.data);
      } catch (error) {
        Alert.alert("Error", "Failed to load routes and buses");
      }
    };
    fetchDropdownData();
  }, [token]);

  const handleSave = async () => {
    if (!routeId || !busId || !departureDate || !departureTime || !arrivalTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const payload = {
      routeId,
      busId,
      departureDate,
      departureTime,
      arrivalTime,
      status,
    };

    try {
      if (existingSchedule) {
        await api.put(`/schedules/${existingSchedule._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Schedule updated successfully");
      } else {
        await api.post("/schedules", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Success", "Schedule created successfully");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save schedule");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {existingSchedule ? "Edit Schedule" : "Add Schedule"}
      </Text>

      <Text style={styles.label}>Select Route</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={routeId}
          onValueChange={(itemValue) => setRouteId(itemValue)}
        >
          <Picker.Item label="-- Select a Route --" value="" />
          {routesList.map((r) => (
            <Picker.Item
              key={r._id}
              label={`${r.startLocation} to ${r.endLocation}`}
              value={r._id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Select Bus</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={busId}
          onValueChange={(itemValue) => setBusId(itemValue)}
        >
          <Picker.Item label="-- Select a Bus --" value="" />
          {busesList.map((b) => (
            <Picker.Item
              key={b._id}
              label={`${b.busName} (${b.licenseNumber})`}
              value={b._id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Departure Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={departureDate}
        onChangeText={setDepartureDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Departure Time (e.g. 08:00 AM)</Text>
      <TextInput
        style={styles.input}
        value={departureTime}
        onChangeText={setDepartureTime}
        placeholder="08:00 AM"
      />

      <Text style={styles.label}>Arrival Time (e.g. 12:30 PM)</Text>
      <TextInput
        style={styles.input}
        value={arrivalTime}
        onChangeText={setArrivalTime}
        placeholder="12:30 PM"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Scheduled" value="Scheduled" />
          <Picker.Item label="Completed" value="Completed" />
          <Picker.Item label="Cancelled" value="Cancelled" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScheduleFormScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#eef4ff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#334155" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "#3567e0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
