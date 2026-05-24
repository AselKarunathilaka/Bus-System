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
        <Text className="text-lg font-bold text-white">
          {item.routeId?.startLocation} to {item.routeId?.endLocation}
        </Text>
        <Text className="bg-cyan-500/20 text-cyan-200 px-2 py-1 rounded border border-cyan-500/30 text-xs font-bold overflow-hidden">
          {item.status}
        </Text>
      </View>
      <Text className="text-sm text-indigo-100 mb-1 font-semibold">Bus: {item.busId?.licenseNumber}</Text>
      <Text className="text-sm text-indigo-100 mb-1 font-semibold">
        Date: {new Date(item.departureDate).toLocaleDateString()}
      </Text>
      <Text className="text-sm text-indigo-100 mb-3 font-semibold">
        Time: {item.departureTime} - {item.arrivalTime}
      </Text>
      <View className="flex-row justify-end mt-2">
        <TouchableOpacity
          className="bg-blue-500/80 px-4 py-2 rounded-lg border border-blue-400/50 mr-3"
          onPress={() => navigation.navigate("ScheduleForm", { schedule: item })}
        >
          <Text className="text-white font-bold text-sm">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500/80 px-4 py-2 rounded-lg border border-red-400/50"
          onPress={() => handleDelete(item._id)}
        >
          <Text className="text-white font-bold text-sm">Delete</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <Text className="text-3xl font-black text-white mb-5 shadow-sm">Manage Schedules</Text>
        <GlassButton
          title="+ Add New Schedule"
          onPress={() => navigation.navigate("ScheduleForm")}
          className="mb-6 border-emerald-400/50"
          textClassName="text-emerald-300 font-extrabold"
        />
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
        ) : schedules.length === 0 ? (
          <Text className="text-center text-indigo-200 mt-5 font-semibold text-base">No schedules found</Text>
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
