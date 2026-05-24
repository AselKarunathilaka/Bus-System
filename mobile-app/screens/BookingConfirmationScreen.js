import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { schedule, selectedSeats, bookingType } = route.params;
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [contactNumber, setContactNumber] = useState("");

  const isAdmin = user?.role === "admin";

  const basePrice = schedule.routeId?.price || 0;
  const totalPrice = basePrice * selectedSeats.length;

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  const formattedSeats = selectedSeats.map(getSeatLabel).join(", ");

  const handleConfirm = async () => {
    if (!isAdmin && (!contactNumber || contactNumber.trim() === "")) {
      Alert.alert("Error", "Contact number is required for your booking.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        scheduleId: schedule._id,
        seatNumbers: selectedSeats,
        bookingType,
        totalPrice,
        contactNumber,
      };

      await api.post("/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Platform.OS === "web") {
        window.alert("Booking confirmed successfully!");
        navigation.navigate("MainTabs", { screen: "BookingsTab" });
      } else {
        Alert.alert("Success", "Booking confirmed successfully!", [
          {
            text: isAdmin ? "View Bookings" : "View My Bookings",
            onPress: () => {
              navigation.navigate("MainTabs", { screen: "BookingsTab" });
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiquidBackground>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 120 }}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">Confirm Booking</Text>
        </View>

        <GlassCard className="mb-6">
          <Text className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-black/5">Journey Details</Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-bold text-slate-500 uppercase">Route</Text>
            <Text className="text-sm font-bold text-slate-900 text-right flex-1 ml-4">{schedule.routeId?.startLocation} to {schedule.routeId?.endLocation}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-bold text-slate-500 uppercase">Bus</Text>
            <Text className="text-sm font-bold text-slate-900 text-right flex-1 ml-4">{schedule.busId?.busName} ({schedule.busId?.licenseNumber})</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-bold text-slate-500 uppercase">Date</Text>
            <Text className="text-sm font-bold text-slate-900">{new Date(schedule.departureDate).toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm font-bold text-slate-500 uppercase">Time</Text>
            <Text className="text-sm font-bold text-slate-900">{schedule.departureTime} - {schedule.arrivalTime}</Text>
          </View>
        </GlassCard>

        <GlassCard className="mb-6">
          <Text className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-black/5">Ticket Details</Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-bold text-slate-500 uppercase">Booking Type</Text>
            <Text className="text-sm font-bold text-slate-900">{bookingType}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-sm font-bold text-slate-500 uppercase">Seats</Text>
            <Text className="text-sm font-bold text-slate-900">{formattedSeats}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm font-bold text-slate-500 uppercase">Seat Count</Text>
            <Text className="text-sm font-bold text-slate-900">{selectedSeats.length}</Text>
          </View>
        </GlassCard>

        <GlassCard className="mb-6">
          <Text className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-black/5">Contact Info</Text>
          <TextInput
            className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl font-semibold text-base"
            placeholder="Enter Phone Number"
            placeholderTextColor="#94a3b8"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            maxLength={12}
          />
          {isAdmin && <Text className="text-xs font-bold text-slate-400 mt-2 text-right">Optional for Admins</Text>}
        </GlassCard>

        <View className="bg-[#007AFF] rounded-3xl p-6 items-center justify-center mb-10 shadow-sm border border-[#007AFF]/20">
          <Text className="text-white/80 font-bold uppercase text-sm mb-1 tracking-widest">Total Amount</Text>
          <Text className="text-white font-black text-4xl">LKR {totalPrice}</Text>
        </View>

        <View className="mb-10">
          <GlassButton
            title={loading ? "Confirming..." : "Confirm Booking"}
            onPress={handleConfirm}
            className={`mb-4 border-[#007AFF]/20 ${loading ? 'opacity-70' : ''}`}
            textClassName="text-white font-extrabold"
            disabled={loading}
          />
        </View>
      </ScrollView>
    </LiquidBackground>
  );
};

export default BookingConfirmationScreen;

