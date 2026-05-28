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
import GlassInput from "../components/GlassInput";
import { Ionicons } from "@expo/vector-icons";

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { schedule, selectedSeats, bookingType } = route.params;
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [contactNumber, setContactNumber] = useState(user?.phone || "");
  const [passengerName, setPassengerName] = useState(user?.fullName || "");
  const [adminNote, setAdminNote] = useState("");

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
    if (!isAdmin && (!passengerName || passengerName.trim() === "")) {
      Alert.alert("Error", "Passenger name is required for your booking.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        scheduleId: schedule._id,
        seatNumbers: selectedSeats,
        bookingType,
        totalPrice, // Note: Backend recalculates this securely
        contactNumber,
        passengerName,
        passengerPhone: contactNumber,
        adminNote: isAdmin ? adminNote : undefined,
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
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-textDark shadow-sm tracking-tight">Confirm Booking</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={20} color="#2F80ED" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 relative">
          {/* Ticket styling with dashed borders */}
          <GlassCard className="border-b-0 rounded-b-none border-dashed border-[rgba(255,255,255,0.5)] pb-8">
            <View className="flex-row items-center mb-6 border-b border-[rgba(255,255,255,0.5)] pb-4">
              <View className="bg-[rgba(255,255,255,0.6)] p-2 rounded-full mr-3 border border-[rgba(255,255,255,0.8)]">
                <Ionicons name="bus" size={20} color="#2F80ED" />
              </View>
              <Text className="text-xl font-bold text-textDark tracking-tight">Digital Ticket</Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">From</Text>
                <Text className="text-base font-bold text-textDark">{schedule.routeId?.startLocation}</Text>
              </View>
              <View className="px-4 justify-center">
                <Ionicons name="arrow-forward" size={20} color="#2F80ED" />
              </View>
              <View className="flex-1 items-end">
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">To</Text>
                <Text className="text-base font-bold text-textDark">{schedule.routeId?.endLocation}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4 border-t border-[rgba(255,255,255,0.3)] pt-4">
              <View>
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Date</Text>
                <Text className="text-sm font-bold text-textDark">{new Date(schedule.departureDate).toLocaleDateString()}</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Time</Text>
                <Text className="text-sm font-bold text-textDark">{schedule.departureTime} - {schedule.arrivalTime}</Text>
              </View>
            </View>

            <View className="flex-row justify-between border-t border-[rgba(255,255,255,0.3)] pt-4">
              <View>
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Bus</Text>
                <Text className="text-sm font-bold text-textDark">{schedule.busId?.licenseNumber}</Text>
              </View>
              <View className="items-center">
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Type</Text>
                <Text className="text-sm font-bold text-textDark">{bookingType}</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Seats ({selectedSeats.length})</Text>
                <Text className="text-sm font-bold text-primary">{formattedSeats}</Text>
              </View>
            </View>
          </GlassCard>

          {/* Ticket Cutouts */}
          <View className="flex-row justify-between items-center absolute left-0 right-0" style={{ bottom: -12, zIndex: 10 }}>
            <View className="w-6 h-6 bg-[#EAF6FF] rounded-full -ml-3" />
            <View className="flex-1 border-t-2 border-dashed border-[rgba(255,255,255,0.5)] mx-2" />
            <View className="w-6 h-6 bg-[#EAF6FF] rounded-full -mr-3" />
          </View>

          {/* Ticket Bottom - Price */}
          <GlassCard className="border-t-0 rounded-t-none bg-[rgba(255,255,255,0.3)] border-dashed border-[rgba(255,255,255,0.5)] pt-8">
            <View className="items-center">
              <Text className="text-textMuted font-bold uppercase text-xs mb-1 tracking-widest">Total Amount</Text>
              <Text className="text-textDark font-black text-4xl">
                <Text className="text-lg text-textMuted mr-1">LKR</Text> {totalPrice.toLocaleString()}
              </Text>
            </View>
          </GlassCard>
        </View>

        <GlassCard className="mb-8">
          <Text className="text-base font-bold text-textDark mb-4 pb-2 border-b border-[rgba(255,255,255,0.5)]">
            {isAdmin ? "Passenger Information (Optional)" : "Passenger Information"}
          </Text>
          <GlassInput
            icon="person"
            placeholder={isAdmin ? "Customer Name (Optional)" : "Primary Passenger Name *"}
            value={passengerName}
            onChangeText={setPassengerName}
            className="mb-3"
            containerClassName="mb-3"
          />
          <GlassInput
            icon="call"
            placeholder={isAdmin ? "Customer Phone Number (Optional)" : "Contact Phone Number *"}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            maxLength={15}
            className={isAdmin ? "mb-3" : "mb-0"}
            containerClassName={isAdmin ? "mb-3" : "mb-0"}
          />
          {isAdmin && (
            <GlassInput
              icon="document-text"
              placeholder="Admin Note (Optional)"
              value={adminNote}
              onChangeText={setAdminNote}
              multiline
              numberOfLines={2}
              className="h-16 py-2 mb-0"
              containerClassName="mb-0"
            />
          )}
        </GlassCard>

        <View className="mb-10">
          <GlassButton
            title={loading ? "Confirming..." : "Confirm Booking"}
            onPress={handleConfirm}
            className={`mb-4 border-[rgba(255,255,255,0.5)] ${loading ? 'opacity-70' : ''}`}
            textClassName="text-white font-extrabold"
            disabled={loading}
          />
        </View>
      </ScrollView>
    </LiquidBackground>
  );
};

export default BookingConfirmationScreen;

