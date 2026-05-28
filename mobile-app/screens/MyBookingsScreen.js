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
        <View className="bg-[rgba(255,255,255,0.4)] p-4 border border-[rgba(255,255,255,0.5)] border-b-0 rounded-t-2xl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-textDark flex-1 pr-3 tracking-tight">
              {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <Text className="text-xs text-textMuted font-bold uppercase tracking-widest">
            Booking ID: {item.bookingId || "N/A"}
          </Text>
        </View>

        {/* Ticket Body (Dashed border simulation) */}
        <View className="bg-[rgba(255,255,255,0.3)] p-4 border-l border-r border-[rgba(255,255,255,0.5)] border-dashed border-t border-b-0 relative">
          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Bus</Text>
              <Text className="text-sm font-bold text-textDark">{item.scheduleId?.busId?.licenseNumber}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Seats</Text>
              <Text className="text-sm font-bold text-primary">{formattedSeats}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3">
            <View>
              <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Date & Time</Text>
              <Text className="text-sm font-bold text-textDark">
                {new Date(item.scheduleId?.departureDate).toLocaleDateString()} at {item.scheduleId?.departureTime}
              </Text>
            </View>
          </View>
          
          {item.contactNumber && (
            <View className="flex-row justify-between">
              <View>
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Contact</Text>
                <Text className="text-sm font-bold text-textDark">{item.contactNumber}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Ticket Footer (Total Price) */}
        <View className="bg-[rgba(255,255,255,0.3)] p-4 border border-[rgba(255,255,255,0.5)] border-t-0 rounded-b-2xl border-dashed">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Total Paid</Text>
              <Text className="text-xl font-black text-textDark">LKR {item.totalPrice}</Text>
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
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-white tracking-tight ml-2 mt-1">My Bookings</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={20} color="#2F80ED" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2F80ED" />
            <Text className="mt-3 text-primary font-semibold">Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="ticket-outline" size={64} color="#2F80ED" />
            <Text className="text-primary mt-4 font-bold text-lg">No bookings yet</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Your digital tickets will appear here.</Text>
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
