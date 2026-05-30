import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
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
    <AppLayout useSafeArea>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 120 }}>
          <View className="flex-row items-center justify-between mb-8 max-w-2xl w-full self-center">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
                <Ionicons name="arrow-back" size={24} color="#64748B" />
              </TouchableOpacity>
              <Text className="text-2xl font-extrabold text-textDark tracking-tight">
                {existingSchedule ? "Edit Schedule" : "Add Schedule"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
              <Ionicons name="home-outline" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <AppCard className="mb-6 max-w-2xl w-full self-center">
            <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Select Route</Text>
            <View className="bg-background border border-border rounded-xl mb-4 overflow-hidden">
              {Platform.OS === 'web' ? (
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#0F172A", outlineWidth: 0, cursor: "pointer", fontFamily: "inherit" }}
                >
                  <option value="" style={{color:"#0F172A"}}>-- Select a Route --</option>
                  {routesList.map((r) => (
                    <option key={r._id} value={r._id} style={{color:"#0F172A"}}>
                      {r.startLocation} to {r.endLocation}
                    </option>
                  ))}
                </select>
              ) : (
                <Picker selectedValue={routeId} onValueChange={(v) => setRouteId(v)} dropdownIconColor="#64748B" style={{color:"#0F172A"}}>
                  <Picker.Item label="-- Select a Route --" value="" />
                  {routesList.map((r) => (
                    <Picker.Item key={r._id} label={`${r.startLocation} to ${r.endLocation}`} value={r._id} />
                  ))}
                </Picker>
              )}
            </View>

            <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Select Bus</Text>
            <View className={`bg-background border border-border rounded-xl mb-4 overflow-hidden ${!routeId ? 'opacity-50' : ''}`}>
              {Platform.OS === 'web' ? (
                <select
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#0F172A", outlineWidth: 0, cursor: "pointer", fontFamily: "inherit" }}
                  disabled={!routeId}
                >
                  <option value="" style={{color:"#0F172A"}}>-- Select a Bus --</option>
                  {filteredBuses.map((b) => (
                    <option key={b._id} value={b._id} style={{color:"#0F172A"}}>
                      {b.busName} ({b.licenseNumber})
                    </option>
                  ))}
                </select>
              ) : (
                <Picker selectedValue={busId} onValueChange={(v) => setBusId(v)} enabled={!!routeId} dropdownIconColor="#64748B" style={{color:"#0F172A"}}>
                  <Picker.Item label="-- Select a Bus --" value="" />
                  {filteredBuses.map((b) => (
                    <Picker.Item key={b._id} label={`${b.busName} (${b.licenseNumber})`} value={b._id} />
                  ))}
                </Picker>
              )}
            </View>

            <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1 mt-2">Departure Date</Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, backgroundColor: "#F8FAFC", marginBottom: 16, color: "#0F172A", outlineWidth: 0, fontFamily: "inherit", fontWeight: "500" }}
              />
            ) : (
              <AppInput
                icon="calendar-outline"
                value={departureDate}
                onChangeText={setDepartureDate}
                placeholder="YYYY-MM-DD"
                containerClassName="mb-4"
              />
            )}

            <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Departure Time</Text>
            {Platform.OS === 'web' ? (
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, backgroundColor: "#F8FAFC", marginBottom: 16, color: "#0F172A", outlineWidth: 0, fontFamily: "inherit", fontWeight: "500" }}
              />
            ) : (
              <AppInput
                icon="time-outline"
                value={departureTime}
                onChangeText={setDepartureTime}
                placeholder="08:00 AM"
                containerClassName="mb-4"
              />
            )}

            <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Arrival Time</Text>
            {Platform.OS === 'web' ? (
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, backgroundColor: "#F8FAFC", marginBottom: 16, color: "#0F172A", outlineWidth: 0, fontFamily: "inherit", fontWeight: "500" }}
              />
            ) : (
              <AppInput
                icon="time-outline"
                value={arrivalTime}
                onChangeText={setArrivalTime}
                placeholder="12:30 PM"
                containerClassName="mb-4"
              />
            )}

            <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Status</Text>
            <View className="bg-background border border-border rounded-xl mb-2 overflow-hidden">
              {Platform.OS === 'web' ? (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: "100%", padding: 16, fontSize: 16, borderWidth: 0, backgroundColor: "transparent", color: "#0F172A", outlineWidth: 0, cursor: "pointer", fontFamily: "inherit", fontWeight: "500" }}
                >
                  <option value="Scheduled" style={{color:"#0F172A"}}>Scheduled</option>
                  <option value="Completed" style={{color:"#0F172A"}}>Completed</option>
                  <option value="Cancelled" style={{color:"#0F172A"}}>Cancelled</option>
                </select>
              ) : (
                <Picker selectedValue={status} onValueChange={(v) => setStatus(v)} dropdownIconColor="#64748B" style={{color:"#0F172A"}}>
                  <Picker.Item label="Scheduled" value="Scheduled" />
                  <Picker.Item label="Completed" value="Completed" />
                  <Picker.Item label="Cancelled" value="Cancelled" />
                </Picker>
              )}
            </View>
          </AppCard>

          <View className="mb-10 max-w-2xl w-full self-center gap-3">
            <AppButton
              title="Save Schedule"
              onPress={handleSave}
              variant="primary"
            />

            <AppButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

export default ScheduleFormScreen;
