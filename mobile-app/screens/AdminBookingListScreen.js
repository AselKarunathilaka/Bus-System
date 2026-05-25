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
      <GlassCard className="mb-6 p-0 overflow-hidden">
        {/* Header */}
        <View className="bg-white/10 p-5 border-b border-white/10 flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-black text-white tracking-tight">{item.userId?.fullName || "Unknown User"}</Text>
            <Text className="text-xs text-[#38bdf8] font-bold uppercase tracking-widest mt-1">
              ID: {item.bookingId || "N/A"}
            </Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        {/* Body */}
        <View className="p-5">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Route</Text>
              <Text className="text-sm font-bold text-white">{item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bus</Text>
              <Text className="text-sm font-bold text-white">{item.scheduleId?.busId?.licenseNumber}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</Text>
              <Text className="text-sm font-bold text-white">
                {new Date(item.scheduleId?.departureDate).toLocaleDateString()}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seats ({item.bookingType})</Text>
              <Text className="text-sm font-bold text-emerald-400">{formattedSeats}</Text>
            </View>
          </View>

          {item.contactNumber && (
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</Text>
                <Text className="text-sm font-bold text-white">{item.contactNumber}</Text>
              </View>
            </View>
          )}

          <View className="flex-row justify-between pt-1">
            <View>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Booked On</Text>
              <Text className="text-sm font-bold text-slate-300">{new Date(item.bookingDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="bg-gradient-to-r from-blue-600/30 to-cyan-500/20 p-5 border-t border-white/10 flex-row justify-between items-center">
          <View>
            <Text className="text-[10px] text-cyan-200 font-bold uppercase tracking-widest mb-1">Total</Text>
            <Text className="text-2xl font-black text-white">LKR {item.totalPrice}</Text>
          </View>
          <View className="flex-row">
            {item.status !== "Cancelled" && (
              <TouchableOpacity
                className="bg-amber-500/30 px-4 py-2.5 rounded-xl ml-2 border border-amber-500/50 shadow-sm"
                onPress={() => handleCancel(item._id)}
              >
                <Text className="text-amber-300 font-bold text-xs uppercase tracking-wider">Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-red-500/30 px-4 py-2.5 rounded-xl ml-2 border border-red-500/50 shadow-sm"
              onPress={() => handleDelete(item._id)}
            >
              <Text className="text-red-300 font-bold text-xs uppercase tracking-wider">Delete</Text>
            </TouchableOpacity>
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
            <Text className="text-3xl font-bold text-white tracking-tight">All Bookings</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="bg-white/10 p-2 rounded-full border border-white/10">
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
            <Ionicons name="folder-open-outline" size={64} color="#0ea5e9" />
            <Text className="text-cyan-200 mt-4 font-bold text-lg">No bookings found</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">System booking records will appear here.</Text>
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

export default AdminBookingListScreen;

// We've moved styles to Tailwind classes!
