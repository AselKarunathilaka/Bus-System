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

  const filteredBuses = routeId
    ? busesList.filter((b) => {
        const assignedId = b.assignedRoute?._id || b.assignedRoute;
        return assignedId === routeId;
      })
    : [];

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
        if (Platform.OS === "web") window.alert("Schedule updated successfully");
        else Alert.alert("Success", "Schedule updated successfully");
      } else {
        await api.post("/schedules", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === "web") window.alert("Schedule created successfully");
        else Alert.alert("Success", "Schedule created successfully");
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to save schedule";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Error", msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {existingSchedule ? "Edit Schedule" : "Add Schedule"}
      </Text>

      <Text style={styles.label}>Select Route</Text>
      <View style={styles.pickerContainer}>
        {Platform.OS === 'web' ? (
          <select
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            style={styles.webSelect}
          >
            <option value="">-- Select a Route --</option>
            {routesList.map((r) => (
              <option key={r._id} value={r._id}>
                {r.startLocation} to {r.endLocation}
              </option>
            ))}
          </select>
        ) : (
          <Picker selectedValue={routeId} onValueChange={(v) => setRouteId(v)}>
            <Picker.Item label="-- Select a Route --" value="" />
            {routesList.map((r) => (
              <Picker.Item key={r._id} label={`${r.startLocation} to ${r.endLocation}`} value={r._id} />
            ))}
          </Picker>
        )}
      </View>

      <Text style={styles.label}>Select Bus</Text>
      <View style={styles.pickerContainer}>
        {Platform.OS === 'web' ? (
          <select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            style={styles.webSelect}
            disabled={!routeId}
          >
            <option value="">-- Select a Bus --</option>
            {filteredBuses.map((b) => (
              <option key={b._id} value={b._id}>
                {b.busName} ({b.licenseNumber})
              </option>
            ))}
          </select>
        ) : (
          <Picker selectedValue={busId} onValueChange={(v) => setBusId(v)} enabled={!!routeId}>
            <Picker.Item label="-- Select a Bus --" value="" />
            {filteredBuses.map((b) => (
              <Picker.Item key={b._id} label={`${b.busName} (${b.licenseNumber})`} value={b._id} />
            ))}
          </Picker>
        )}
      </View>

      <Text style={styles.label}>Departure Date</Text>
      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          style={styles.webInput}
        />
      ) : (
        <TextInput
          style={styles.input}
          value={departureDate}
          onChangeText={setDepartureDate}
          placeholder="YYYY-MM-DD"
        />
      )}

      <Text style={styles.label}>Departure Time</Text>
      {Platform.OS === 'web' ? (
        <input
          type="time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          style={styles.webInput}
        />
      ) : (
        <TextInput
          style={styles.input}
          value={departureTime}
          onChangeText={setDepartureTime}
          placeholder="08:00 AM"
        />
      )}

      <Text style={styles.label}>Arrival Time</Text>
      {Platform.OS === 'web' ? (
        <input
          type="time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          style={styles.webInput}
        />
      ) : (
        <TextInput
          style={styles.input}
          value={arrivalTime}
          onChangeText={setArrivalTime}
          placeholder="12:30 PM"
        />
      )}

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        {Platform.OS === 'web' ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.webSelect}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        ) : (
          <Picker selectedValue={status} onValueChange={(v) => setStatus(v)}>
            <Picker.Item label="Scheduled" value="Scheduled" />
            <Picker.Item label="Completed" value="Completed" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScheduleFormScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 25, color: "#0f172a" },
  label: { fontSize: 15, fontWeight: "700", marginBottom: 8, color: "#334155" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#0f172a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  webSelect: {
    width: "100%",
    padding: 16,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "#0f172a",
    outlineWidth: 0,
    cursor: "pointer",
  },
  webInput: {
    width: "100%",
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
    color: "#0f172a",
    outlineWidth: 0,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  saveButton: {
    backgroundColor: "#3567e0",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#3567e0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold", letterSpacing: 0.5 },
});
