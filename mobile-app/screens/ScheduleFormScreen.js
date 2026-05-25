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
import GlassInput from "../components/GlassInput";
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
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white shadow-sm tracking-tight">
            {existingSchedule ? "Edit Schedule" : "Add Schedule"}
          </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-white/10 p-2 rounded-full border border-white/10">
            <Ionicons name="home" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <GlassCard className="mb-6">
          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Select Route</Text>
          <View className="bg-white/10 border border-white/10 rounded-xl mb-4 overflow-hidden">
            {Platform.OS === 'web' ? (
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#ffffff", outlineWidth: 0, cursor: "pointer" }}
              >
                <option value="" style={{color:"#0f172a"}}>-- Select a Route --</option>
                {routesList.map((r) => (
                  <option key={r._id} value={r._id} style={{color:"#0f172a"}}>
                    {r.startLocation} to {r.endLocation}
                  </option>
                ))}
              </select>
            ) : (
              <Picker selectedValue={routeId} onValueChange={(v) => setRouteId(v)} dropdownIconColor="#ffffff" style={{color:"#ffffff"}}>
                <Picker.Item label="-- Select a Route --" value="" />
                {routesList.map((r) => (
                  <Picker.Item key={r._id} label={`${r.startLocation} to ${r.endLocation}`} value={r._id} />
                ))}
              </Picker>
            )}
          </View>

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Select Bus</Text>
          <View className="bg-white/10 border border-white/10 rounded-xl mb-4 overflow-hidden">
            {Platform.OS === 'web' ? (
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#ffffff", outlineWidth: 0, cursor: "pointer" }}
                disabled={!routeId}
              >
                <option value="" style={{color:"#0f172a"}}>-- Select a Bus --</option>
                {filteredBuses.map((b) => (
                  <option key={b._id} value={b._id} style={{color:"#0f172a"}}>
                    {b.busName} ({b.licenseNumber})
                  </option>
                ))}
              </select>
            ) : (
              <Picker selectedValue={busId} onValueChange={(v) => setBusId(v)} enabled={!!routeId} dropdownIconColor="#ffffff" style={{color:"#ffffff"}}>
                <Picker.Item label="-- Select a Bus --" value="" />
                {filteredBuses.map((b) => (
                  <Picker.Item key={b._id} label={`${b.busName} (${b.licenseNumber})`} value={b._id} />
                ))}
              </Picker>
            )}
          </View>

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Departure Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 16, color: "#ffffff", outlineWidth: 0 }}
            />
          ) : (
            <GlassInput
              icon="calendar"
              value={departureDate}
              onChangeText={setDepartureDate}
              placeholder="YYYY-MM-DD"
            />
          )}

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Departure Time</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 16, color: "#ffffff", outlineWidth: 0 }}
            />
          ) : (
            <GlassInput
              icon="time"
              value={departureTime}
              onChangeText={setDepartureTime}
              placeholder="08:00 AM"
            />
          )}

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Arrival Time</Text>
          {Platform.OS === 'web' ? (
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 16, color: "#ffffff", outlineWidth: 0 }}
            />
          ) : (
            <GlassInput
              icon="time-outline"
              value={arrivalTime}
              onChangeText={setArrivalTime}
              placeholder="12:30 PM"
            />
          )}

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Status</Text>
          <View className="bg-white/10 border border-white/10 rounded-xl mb-4 overflow-hidden">
            {Platform.OS === 'web' ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#ffffff", outlineWidth: 0, cursor: "pointer" }}
              >
                <option value="Scheduled" style={{color:"#0f172a"}}>Scheduled</option>
                <option value="Completed" style={{color:"#0f172a"}}>Completed</option>
                <option value="Cancelled" style={{color:"#0f172a"}}>Cancelled</option>
              </select>
            ) : (
              <Picker selectedValue={status} onValueChange={(v) => setStatus(v)} dropdownIconColor="#ffffff" style={{color:"#ffffff"}}>
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
            className="mb-4 border-white/10"
            textClassName="text-white font-bold"
          />

          <TouchableOpacity 
            className="bg-white/5 border border-white/10 p-4 rounded-xl items-center"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-slate-400 font-bold text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LiquidBackground>
  );
};

export default ScheduleFormScreen;
