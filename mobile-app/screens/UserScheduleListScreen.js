import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const UserScheduleListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out Cancelled schedules
        const activeSchedules = response.data.filter((s) => s.status !== "Cancelled");
        setSchedules(activeSchedules);
      } catch (error) {
        Alert.alert("Error", "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  const renderItem = ({ item }) => {
    const totalSeats = item.busId?.seatCount || 0;
    const bookedCount = item.bookedSeats?.length || 0;
    const availableSeats = totalSeats - bookedCount;

    return (
      <GlassCard className="mb-4">
        <View className="flex-row justify-between items-start mb-3 pb-3 border-b border-white/10">
          <Text className="text-lg font-bold text-white flex-1 pr-3 leading-6">
            {item.routeId?.startLocation} to {item.routeId?.endLocation}
          </Text>
          <Text className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-bold overflow-hidden mt-1">
            LKR {item.routeId?.price}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-slate-400 font-semibold mb-1">
            Bus: {item.busId?.busType} ({item.busId?.licenseNumber})
          </Text>
          <Text className="text-sm text-slate-400 font-semibold mb-1">
            Date: {new Date(item.departureDate).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-slate-400 font-semibold mb-1">
            Time: {item.departureTime} - {item.arrivalTime}
          </Text>
          <Text className="text-sm text-white font-bold mt-2 bg-white/10 self-start px-3 py-1.5 rounded-lg border border-white/10">
            Available Seats: {availableSeats} / {totalSeats}
          </Text>
        </View>

        <GlassButton
          title={availableSeats === 0 ? "Sold Out" : "Select Seats"}
          variant={availableSeats === 0 ? "secondary" : "primary"}
          onPress={() => navigation.navigate("SeatSelection", { schedule: item })}
          disabled={availableSeats === 0}
        />
      </GlassCard>
    );
  };

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-white flex-1 tracking-tight">Available Trips</Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#a855f7" />
            <Text className="mt-3 text-purple-300 font-semibold">Loading available trips...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="bus-outline" size={64} color="#0ea5e9" />
            <Text className="text-cyan-200 mt-4 font-bold text-lg">No trips available</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">There are currently no active bus schedules.</Text>
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

export default UserScheduleListScreen;

// We've moved styles to Tailwind classes!
