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
import StatusBadge from "../components/StatusBadge";
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
        <Text className="text-lg font-bold text-textDark tracking-tight flex-1 pr-3 leading-6">
          {item.routeId?.startLocation} to {item.routeId?.endLocation}
        </Text>
        <StatusBadge status={item.status} />
      </View>
      <Text className="text-sm text-textMuted mb-1 font-semibold">Bus: {item.busId?.licenseNumber}</Text>
      <Text className="text-sm text-textMuted mb-1 font-semibold">
        Date: {new Date(item.departureDate).toLocaleDateString()}
      </Text>
      <Text className="text-sm text-textMuted mb-3 font-semibold">
        Time: {item.departureTime} - {item.arrivalTime}
      </Text>
      <View className="flex-row justify-end mt-2">
        <TouchableOpacity
          className="bg-amber-600 px-4 py-2 rounded-lg shadow-sm border border-amber-500/20 mr-3"
          onPress={() => navigation.navigate("ScheduleForm", { schedule: item })}
        >
          <Text className="text-white font-bold text-sm tracking-wide">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-600 px-4 py-2 rounded-lg shadow-sm border border-red-500/20"
          onPress={() => handleDelete(item._id)}
        >
          <Text className="text-white font-bold text-sm tracking-wide">Delete</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="arrow-back" size={24} color="#2F80ED" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white tracking-tight flex-1">Manage Schedules</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs", { screen: "HomeTab" })} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={22} color="#2F80ED" />
          </TouchableOpacity>
        </View>
        <View className="mb-6 px-1 mt-2">
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-emerald-500/20 py-4 rounded-2xl border border-emerald-500/40 shadow-sm"
            onPress={() => navigation.navigate("ScheduleForm")}
          >
            <Ionicons name="add-circle" size={24} color="#34d399" style={{ marginRight: 8 }} />
            <Text className="text-emerald-300 font-black text-lg tracking-widest uppercase">Add New Schedule</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2F80ED" />
            <Text className="mt-3 text-primary font-semibold">Loading schedules...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="calendar-outline" size={64} color="#2F80ED" />
            <Text className="text-primary mt-4 font-bold text-lg">No schedules found</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Create a schedule to start assigning buses to routes.</Text>
          </View>
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
