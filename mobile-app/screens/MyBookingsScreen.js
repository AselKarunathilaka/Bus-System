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
      <GlassCard className="mb-5">
        <View className="flex-row justify-between items-center mb-4 border-b border-white/10 pb-4">
          <Text className="text-lg font-bold text-white flex-1 pr-3 tracking-tight">
            {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
          </Text>
          <Text className={`px-3 py-1.5 rounded-lg text-xs font-bold overflow-hidden ${item.status === 'Cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {item.status}
          </Text>
        </View>

        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-400 font-semibold">Booking ID:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{item.bookingId || "N/A"}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-400 font-semibold">Bus:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{item.scheduleId?.busId?.busName} ({item.scheduleId?.busId?.licenseNumber})</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-400 font-semibold">Date:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{new Date(item.scheduleId?.departureDate).toLocaleDateString()} at {item.scheduleId?.departureTime}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-400 font-semibold">Seats:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{formattedSeats} ({item.bookingType})</Text>
          </View>
          {item.contactNumber && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-slate-400 font-semibold">Contact:</Text>
              <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{item.contactNumber}</Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center border-t border-white/10 pt-4">
          <Text className="text-xl font-bold text-[#38bdf8]">Total: LKR {item.totalPrice}</Text>
          
          {item.status !== "Cancelled" && (
            <TouchableOpacity
              className="bg-red-500/20 px-3 py-2 rounded-lg ml-2 border border-red-500/30"
              onPress={() => handleCancel(item._id)}
            >
              <Text className="text-red-400 font-bold text-xs">Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>
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
          <Text className="text-3xl font-bold text-white shadow-sm flex-1 tracking-tight">My Bookings</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 20 }} />
        ) : bookings.length === 0 ? (
          <Text className="text-center text-slate-400 mt-10 text-base font-semibold">You haven't made any bookings yet.</Text>
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
