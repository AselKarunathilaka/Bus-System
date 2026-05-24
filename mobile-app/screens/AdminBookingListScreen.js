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
        <View className="flex-row justify-between items-center mb-4 border-b border-black/5 pb-4">
          <View>
            <Text className="text-lg font-extrabold text-slate-900">{item.userId?.fullName || "Unknown User"}</Text>
            <Text className="text-xs text-slate-500 mt-1 font-semibold">ID: {item.bookingId || "N/A"}</Text>
          </View>
          <Text className={`px-3 py-1.5 rounded-lg text-xs font-bold overflow-hidden ${item.status === 'Cancelled' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
            {item.status}
          </Text>
        </View>

        <View className="mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500 font-semibold">Route:</Text>
            <Text className="text-sm text-slate-900 font-bold text-right flex-1 ml-2">
              {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500 font-semibold">Bus:</Text>
            <Text className="text-sm text-slate-900 font-bold text-right flex-1 ml-2">
              {item.scheduleId?.busId?.busName} ({item.scheduleId?.busId?.licenseNumber})
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500 font-semibold">Seats:</Text>
            <Text className="text-sm text-slate-900 font-bold text-right flex-1 ml-2">{formattedSeats} ({item.bookingType})</Text>
          </View>
          {item.contactNumber && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-slate-500 font-semibold">Contact:</Text>
              <Text className="text-sm text-slate-900 font-bold text-right flex-1 ml-2">{item.contactNumber}</Text>
            </View>
          )}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500 font-semibold">Booked On:</Text>
            <Text className="text-sm text-slate-900 font-bold text-right flex-1 ml-2">{new Date(item.bookingDate).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center border-t border-black/5 pt-4">
          <Text className="text-xl font-black text-[#007AFF]">LKR {item.totalPrice}</Text>
          <View className="flex-row">
            {item.status !== "Cancelled" && (
              <TouchableOpacity
                className="bg-amber-100 px-3 py-2 rounded-lg ml-2 border border-amber-200"
                onPress={() => handleCancel(item._id)}
              >
                <Text className="text-amber-600 font-bold text-xs">Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-red-100 px-3 py-2 rounded-lg ml-2 border border-red-200"
              onPress={() => handleDelete(item._id)}
            >
              <Text className="text-red-600 font-bold text-xs">Delete</Text>
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
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-slate-900 shadow-sm tracking-tight">All Bookings</Text>
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0f172a" style={{ marginTop: 20 }} />
        ) : bookings.length === 0 ? (
          <Text className="text-center text-slate-500 mt-10 text-base font-semibold">No bookings found</Text>
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
