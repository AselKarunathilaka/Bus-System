import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppBadge from "../components/ui/AppBadge";
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
      <View className="mb-6 self-center w-full max-w-md">
        {/* Ticket Header */}
        <View className="bg-primary/5 p-5 border border-primary/20 border-b-0 rounded-t-3xl relative overflow-hidden">
          <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10" />
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-textDark flex-1 pr-3 tracking-tight leading-7">
              {item.scheduleId?.routeId?.startLocation} <Text className="text-primary font-black px-2">→</Text> {item.scheduleId?.routeId?.endLocation}
            </Text>
            <AppBadge status={item.status} />
          </View>
          <View className="bg-white/60 self-start px-3 py-1.5 rounded-lg border border-primary/10">
            <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest">
              Booking ID: <Text className="text-textDark">{item.bookingId || "N/A"}</Text>
            </Text>
          </View>
        </View>

        {/* Ticket Body (Dashed border simulation) */}
        <View className="bg-white p-5 border-l border-r border-slate-200 border-dashed border-t-2 relative">
          <View className="flex-row justify-between items-center absolute left-0 right-0 -top-[13px] z-10 px-0">
            <View className="w-6 h-6 bg-background rounded-full -ml-3 border-r border-slate-200" />
            <View className="w-6 h-6 bg-background rounded-full -mr-3 border-l border-slate-200" />
          </View>

          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Bus</Text>
              <Text className="text-sm font-bold text-textDark">{item.scheduleId?.busId?.licenseNumber}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Seats</Text>
              <Text className="text-sm font-bold text-primary">{formattedSeats}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Date & Time</Text>
              <Text className="text-sm font-bold text-textDark">
                {new Date(item.scheduleId?.departureDate).toLocaleDateString()} at {item.scheduleId?.departureTime}
              </Text>
            </View>
          </View>
          
          {item.contactNumber && (
            <View className="flex-row justify-between">
              <View>
                <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Contact</Text>
                <Text className="text-sm font-bold text-textDark">{item.contactNumber}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Ticket Footer (Total Price) */}
        <View className="bg-slate-50 p-5 border border-slate-200 border-t-2 rounded-b-3xl border-dashed relative">
          <View className="flex-row justify-between items-center absolute left-0 right-0 -top-[13px] z-10 px-0">
            <View className="w-6 h-6 bg-background rounded-full -ml-3 border-r border-slate-200" />
            <View className="w-6 h-6 bg-background rounded-full -mr-3 border-l border-slate-200" />
          </View>
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1.5">Total Paid</Text>
              <Text className="text-2xl font-black text-textDark tracking-tight">
                <Text className="text-sm text-textMuted mr-1">LKR</Text> {item.totalPrice}
              </Text>
            </View>
            
            {item.status !== "Cancelled" && (
              <TouchableOpacity
                className="bg-red-50 px-4 py-2.5 rounded-xl border border-red-200 active:bg-red-100"
                onPress={() => handleCancel(item._id)}
              >
                <Text className="text-red-600 font-bold text-xs uppercase tracking-wider">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
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
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">My Bookings</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="items-center justify-center mt-20 opacity-80">
            <Ionicons name="ticket-outline" size={64} color="#94A3B8" />
            <Text className="text-textDark mt-4 font-bold text-lg">No bookings yet</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Your digital tickets will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
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

export default MyBookingsScreen;
