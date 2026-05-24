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
        <View className="flex-row justify-between items-start mb-3 pb-3 border-b border-black/5">
          <Text className="text-lg font-extrabold text-slate-900 flex-1 pr-3 leading-6">
            {item.routeId?.startLocation} to {item.routeId?.endLocation}
          </Text>
          <Text className="bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-black overflow-hidden mt-1">
            LKR {item.routeId?.price}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-slate-500 font-semibold mb-1">
            Bus: {item.busId?.busType} ({item.busId?.licenseNumber})
          </Text>
          <Text className="text-sm text-slate-500 font-semibold mb-1">
            Date: {new Date(item.departureDate).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-slate-500 font-semibold mb-1">
            Time: {item.departureTime} - {item.arrivalTime}
          </Text>
          <Text className="text-sm text-slate-900 font-black mt-2 bg-black/5 self-start px-3 py-1.5 rounded-lg border border-black/5">
            Available Seats: {availableSeats} / {totalSeats}
          </Text>
        </View>

        <TouchableOpacity
          className={`px-4 py-3 rounded-xl items-center border ${
            availableSeats === 0
              ? "bg-slate-100 border-slate-200"
              : "bg-[#007AFF] border-[#007AFF]"
          }`}
          disabled={availableSeats === 0}
          onPress={() => navigation.navigate("SeatSelection", { schedule: item })}
        >
          <Text className={`font-black text-base ${availableSeats === 0 ? "text-slate-400" : "text-white"}`}>
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
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">Available Trips</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0f172a" style={{ marginTop: 20 }} />
        ) : schedules.length === 0 ? (
          <Text className="text-center text-slate-500 mt-10 font-bold text-base">No available trips found</Text>
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
