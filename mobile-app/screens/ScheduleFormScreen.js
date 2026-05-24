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
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

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
    <LiquidBackground>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 120 }}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">
            {existingSchedule ? "Edit Schedule" : "Add Schedule"}
          </Text>
        </View>

        <GlassCard className="mb-6">
          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Select Route</Text>
          <View className="bg-black/5 border border-black/10 rounded-xl mb-4 overflow-hidden">
            {Platform.OS === 'web' ? (
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#0f172a", outlineWidth: 0, cursor: "pointer" }}
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

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Select Bus</Text>
          <View className="bg-black/5 border border-black/10 rounded-xl mb-4 overflow-hidden">
            {Platform.OS === 'web' ? (
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#0f172a", outlineWidth: 0, cursor: "pointer" }}
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

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Departure Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", borderRadius: 12, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16, color: "#0f172a", outlineWidth: 0 }}
            />
          ) : (
            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              value={departureDate}
              onChangeText={setDepartureDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
            />
          )}

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Departure Time</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", borderRadius: 12, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16, color: "#0f172a", outlineWidth: 0 }}
            />
          ) : (
            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              value={departureTime}
              onChangeText={setDepartureTime}
              placeholder="08:00 AM"
              placeholderTextColor="#94a3b8"
            />
          )}

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Arrival Time</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", borderRadius: 12, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 16, color: "#0f172a", outlineWidth: 0 }}
            />
          ) : (
            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              value={arrivalTime}
              onChangeText={setArrivalTime}
              placeholder="12:30 PM"
              placeholderTextColor="#94a3b8"
            />
          )}

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Status</Text>
          <View className="bg-black/5 border border-black/10 rounded-xl mb-4 overflow-hidden">
            {Platform.OS === 'web' ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#0f172a", outlineWidth: 0, cursor: "pointer" }}
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
        </GlassCard>

        <View className="mb-10">
          <GlassButton
            title="Save Schedule"
            onPress={handleSave}
            className="mb-4 border-[#007AFF]/20"
            textClassName="text-white font-extrabold"
          />

          <TouchableOpacity 
            className="bg-white border border-slate-300 p-4 rounded-xl items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-slate-600 font-bold text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LiquidBackground>
  );
};

export default ScheduleFormScreen;
