import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
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
      <AppCard className="mb-4">
        <View className="flex-row justify-between items-start mb-4 pb-4 border-b border-border">
          <Text className="text-lg font-bold text-textDark flex-1 pr-3 leading-6 tracking-tight">
            {item.routeId?.startLocation} to {item.routeId?.endLocation}
          </Text>
          <View className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 mt-1">
            <Text className="text-emerald-700 text-xs font-bold">LKR {item.routeId?.price}</Text>
          </View>
        </View>

        <View className="mb-5 flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-3">
            <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Bus Type</Text>
            <Text className="text-sm text-textDark font-bold">{item.busId?.busType}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Date</Text>
            <Text className="text-sm text-textDark font-bold">{new Date(item.departureDate).toLocaleDateString()}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Time</Text>
            <Text className="text-sm text-textDark font-bold">{item.departureTime} - {item.arrivalTime}</Text>
          </View>
          <View className="w-[48%] mb-3">
            <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Available Seats</Text>
            <Text className="text-sm text-textDark font-bold">{availableSeats} / {totalSeats}</Text>
          </View>
        </View>

        <AppButton
          title={availableSeats === 0 ? "Sold Out" : "Select Seats"}
          variant={availableSeats === 0 ? "secondary" : "primary"}
          onPress={() => navigation.navigate("SeatSelection", { schedule: item })}
          disabled={availableSeats === 0}
        />
      </AppCard>
    );
  };

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Available Buses</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading available trips...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View className="items-center justify-center mt-20 opacity-80">
            <Ionicons name="bus-outline" size={64} color="#94A3B8" />
            <Text className="text-textDark mt-4 font-bold text-lg">No trips available</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">There are currently no active bus schedules.</Text>
          </View>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
};

export default UserScheduleListScreen;
