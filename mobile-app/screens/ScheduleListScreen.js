import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const ScheduleListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(response.data);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchSchedules();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/schedules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS !== "web") {
          Alert.alert("Success", "Schedule deleted successfully");
        } else {
          window.alert("Schedule deleted successfully");
        }
        fetchSchedules();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete schedule";
        if (Platform.OS !== "web") {
          Alert.alert("Error", msg);
        } else {
          window.alert(msg);
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this schedule?");
      if (confirmed) {
        executeDelete();
      }
    } else {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this schedule?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: executeDelete,
        },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <GlassCard className="mb-4 p-4">
      <View className="flex-row justify-between mb-3">
        <Text className="text-lg font-bold text-slate-900 tracking-tight">
          {item.routeId?.startLocation} to {item.routeId?.endLocation}
        </Text>
        <Text className="bg-blue-100 text-blue-600 px-2 py-1 rounded border border-blue-200 text-xs font-bold overflow-hidden">
          {item.status}
        </Text>
      </View>
      <Text className="text-sm text-slate-500 mb-1 font-semibold">Bus: {item.busId?.licenseNumber}</Text>
      <Text className="text-sm text-slate-500 mb-1 font-semibold">
        Date: {new Date(item.departureDate).toLocaleDateString()}
      </Text>
      <Text className="text-sm text-slate-500 mb-3 font-semibold">
        Time: {item.departureTime} - {item.arrivalTime}
      </Text>
      <View className="flex-row justify-end mt-2">
        <TouchableOpacity
          className="bg-[#007AFF]/10 px-4 py-2 rounded-lg border border-[#007AFF]/20 mr-3"
          onPress={() => navigation.navigate("ScheduleForm", { schedule: item })}
        >
          <Text className="text-[#007AFF] font-bold text-sm">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-100 px-4 py-2 rounded-lg border border-red-200"
          onPress={() => handleDelete(item._id)}
        >
          <Text className="text-red-600 font-bold text-sm">Delete</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <Text className="text-3xl font-black text-slate-900 mb-5 shadow-sm tracking-tight">Manage Schedules</Text>
        <GlassButton
          title="+ Add New Schedule"
          onPress={() => navigation.navigate("ScheduleForm")}
          className="mb-6 border-[#007AFF]/20"
          textClassName="text-white font-extrabold"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0f172a" style={{ marginTop: 20 }} />
        ) : schedules.length === 0 ? (
          <Text className="text-center text-slate-500 mt-5 font-semibold text-base">No schedules found</Text>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </LiquidBackground>
  );
};

export default ScheduleListScreen;

// We've moved styles to Tailwind classes!
