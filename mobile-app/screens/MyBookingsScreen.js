import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { Ionicons } from "@expo/vector-icons";

const MyBookingsScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    const executeCancel = async () => {
      try {
        await api.delete(`/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS !== "web") {
          Alert.alert("Success", "Booking cancelled successfully.");
        } else {
          window.alert("Booking cancelled successfully.");
        }
        fetchBookings();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to cancel booking.";
        if (Platform.OS !== "web") {
          Alert.alert("Error", msg);
        } else {
          window.alert(msg);
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to cancel this booking?");
      if (confirmed) {
        executeCancel();
      }
    } else {
      Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: executeCancel,
        },
      ]);
    }
  };

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  const renderItem = ({ item }) => {
    const formattedSeats = item.seatNumbers.map(getSeatLabel).join(", ");
    
    return (
      <GlassCard className="mb-6 p-0 overflow-hidden border-0 bg-transparent shadow-none">
        {/* Ticket Header */}
        <View className="bg-white/10 p-4 border border-white/10 border-b-0 rounded-t-2xl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-white flex-1 pr-3 tracking-tight">
              {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Booking ID: {item.bookingId || "N/A"}
          </Text>
        </View>

        {/* Ticket Body (Dashed border simulation) */}
        <View className="bg-white/5 p-4 border-l border-r border-white/10 border-dashed border-t border-b-0 relative">
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bus</Text>
              <Text className="text-sm font-bold text-white">{item.scheduleId?.busId?.licenseNumber}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Seats</Text>
              <Text className="text-sm font-bold text-cyan-400">{formattedSeats}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</Text>
              <Text className="text-sm font-bold text-white">
                {new Date(item.scheduleId?.departureDate).toLocaleDateString()} at {item.scheduleId?.departureTime}
              </Text>
            </View>
          </View>
          
          {item.contactNumber && (
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</Text>
                <Text className="text-sm font-bold text-white">{item.contactNumber}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Ticket Footer (Total Price) */}
        <View className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 border border-white/10 border-t-0 rounded-b-2xl border-dashed">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Paid</Text>
              <Text className="text-xl font-black text-white">LKR {item.totalPrice}</Text>
            </View>
            
            {item.status !== "Cancelled" && (
              <TouchableOpacity
                className="bg-red-500/20 px-4 py-2 rounded-xl border border-red-500/30"
                onPress={() => handleCancel(item._id)}
              >
                <Text className="text-red-400 font-bold text-xs">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </GlassCard>
    );
  };

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white shadow-sm tracking-tight">My Bookings</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-white/10 p-2 rounded-full border border-white/10">
            <Ionicons name="home" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#a855f7" />
            <Text className="mt-3 text-purple-300 font-semibold">Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="ticket-outline" size={64} color="#0ea5e9" />
            <Text className="text-cyan-200 mt-4 font-bold text-lg">No bookings yet</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">Your digital tickets will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
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

export default MyBookingsScreen;

// We've moved styles to Tailwind classes!
