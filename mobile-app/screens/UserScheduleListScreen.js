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
        <View className="flex-row justify-between items-start mb-3 pb-3 border-b border-white/20">
          <Text className="text-lg font-extrabold text-white flex-1 pr-3 leading-6">
            {item.routeId?.startLocation} to {item.routeId?.endLocation}
          </Text>
          <Text className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-black overflow-hidden mt-1">
            LKR {item.routeId?.price}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-indigo-100 font-semibold mb-1">
            Bus: {item.busId?.busType} ({item.busId?.licenseNumber})
          </Text>
          <Text className="text-sm text-indigo-100 font-semibold mb-1">
            Date: {new Date(item.departureDate).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-indigo-100 font-semibold mb-1">
            Time: {item.departureTime} - {item.arrivalTime}
          </Text>
          <Text className="text-sm text-white font-black mt-2 bg-white/10 self-start px-3 py-1.5 rounded-lg border border-white/20">
            Available Seats: {availableSeats} / {totalSeats}
          </Text>
        </View>

        <TouchableOpacity
          className={`px-4 py-3 rounded-xl items-center border ${
            availableSeats === 0
              ? "bg-slate-500/50 border-slate-400/30"
              : "bg-cyan-500/80 border-cyan-400/50"
          }`}
          disabled={availableSeats === 0}
          onPress={() => navigation.navigate("SeatSelection", { schedule: item })}
        >
          <Text className={`font-black text-base ${availableSeats === 0 ? "text-slate-300" : "text-white"}`}>
            {availableSeats === 0 ? "Sold Out" : "Select Seats"}
          </Text>
        </TouchableOpacity>
      </GlassCard>
    );
  };

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/20">
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-white shadow-sm flex-1">Available Trips</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
        ) : schedules.length === 0 ? (
          <Text className="text-center text-indigo-200 mt-10 font-bold text-base">No available trips found</Text>
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
