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

const AdminBookingListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    const executeCancel = async () => {
      try {
        await api.delete(`/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === "web") window.alert("Booking cancelled successfully.");
        else Alert.alert("Success", "Booking cancelled successfully.");
        
        // Refresh bookings
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
        );
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to cancel booking.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Error", msg);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to cancel this booking?")) executeCancel();
    } else {
      Alert.alert("Cancel", "Are you sure you want to cancel this booking?", [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: executeCancel },
      ]);
    }
  };

  const handleDelete = async (bookingId) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/bookings/admin/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === "web") window.alert("Booking deleted permanently.");
        else Alert.alert("Success", "Booking deleted permanently.");
        
        // Refresh bookings
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete booking.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Error", msg);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Permanently delete this booking record?")) executeDelete();
    } else {
      Alert.alert("Delete", "Permanently delete this booking record?", [
        { text: "No", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: executeDelete },
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
    const formattedSeats = item.seatNumbers?.map(getSeatLabel).join(", ") || "";

    return (
      <GlassCard className="mb-5">
        <View className="flex-row justify-between items-center mb-4 border-b border-white/20 pb-4">
          <View>
            <Text className="text-lg font-extrabold text-white">{item.userId?.fullName || "Unknown User"}</Text>
            <Text className="text-xs text-indigo-200 mt-1 font-semibold">ID: {item.bookingId || "N/A"}</Text>
          </View>
          <Text className={`px-3 py-1.5 rounded-lg text-xs font-bold overflow-hidden ${item.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
            {item.status}
          </Text>
        </View>

        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-indigo-200 font-semibold">Route:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">
              {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-indigo-200 font-semibold">Bus:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">
              {item.scheduleId?.busId?.busName} ({item.scheduleId?.busId?.licenseNumber})
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-indigo-200 font-semibold">Seats:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{formattedSeats} ({item.bookingType})</Text>
          </View>
          {item.contactNumber && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-indigo-200 font-semibold">Contact:</Text>
              <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{item.contactNumber}</Text>
            </View>
          )}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-indigo-200 font-semibold">Booked On:</Text>
            <Text className="text-sm text-white font-bold text-right flex-1 ml-2">{new Date(item.bookingDate).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center border-t border-white/20 pt-4">
          <Text className="text-xl font-black text-cyan-300">LKR {item.totalPrice}</Text>
          <View className="flex-row">
            {item.status !== "Cancelled" && (
              <TouchableOpacity
                className="bg-amber-500/20 px-3 py-2 rounded-lg ml-2 border border-amber-500/30"
                onPress={() => handleCancel(item._id)}
              >
                <Text className="text-amber-300 font-bold text-xs">Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-red-500/20 px-3 py-2 rounded-lg ml-2 border border-red-500/30"
              onPress={() => handleDelete(item._id)}
            >
              <Text className="text-red-300 font-bold text-xs">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          <Text className="text-3xl font-black text-white shadow-sm">All Bookings</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 20 }} />
        ) : bookings.length === 0 ? (
          <Text className="text-center text-indigo-200 mt-10 text-base font-semibold">No bookings found</Text>
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

export default AdminBookingListScreen;

// We've moved styles to Tailwind classes!
