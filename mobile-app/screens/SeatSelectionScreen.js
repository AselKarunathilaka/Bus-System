import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const SeatSelectionScreen = ({ route, navigation }) => {
  const { schedule } = route.params;
  const totalSeats = schedule.busId?.seatCount || 0;
  const bookedSeats = schedule.bookedSeats || [];

  const [bookingType, setBookingType] = useState("Single"); // 'Single' or 'Family'
  const [selectedSeats, setSelectedSeats] = useState([]);

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  // Generate rows
  const rows = [];
  for (let i = 0; i < totalSeats; i += 4) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      if (i + j < totalSeats) {
        row.push(i + j + 1);
      } else {
        row.push(null);
      }
    }
    rows.push(row);
  }

  const handleSeatPress = (seatNumber) => {
    if (!seatNumber || bookedSeats.includes(seatNumber)) return;

    const maxSelection = bookingType === "Single" ? 1 : 8;
    const isSelected = selectedSeats.includes(seatNumber);

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= maxSelection) {
        Alert.alert(
          "Selection Limit",
          `You can only select up to ${maxSelection} seat(s) for a ${bookingType} booking.`
        );
        return;
      }
      setSelectedSeats((prev) => [...prev, seatNumber]);
    }
  };

  const handleTypeChange = (type) => {
    setBookingType(type);
    setSelectedSeats([]); // Clear selections on type change
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Error", "Please select at least one seat to continue.");
      return;
    }
    navigation.navigate("BookingConfirmation", {
      schedule,
      selectedSeats,
      bookingType,
    });
  };

  const renderSeat = (seatNumber) => {
    if (!seatNumber) return <View style={[styles.seatBox, styles.seatHidden]} />;

    const isBooked = bookedSeats.includes(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);
    const label = getSeatLabel(seatNumber);

    let seatStyle = styles.seatAvailable;
    let textStyle = styles.seatTextAvailable;

    if (isBooked) {
      seatStyle = styles.seatBooked;
      textStyle = styles.seatTextBooked;
    } else if (isSelected) {
      seatStyle = styles.seatSelected;
      textStyle = styles.seatTextSelected;
    }

    return (
      <TouchableOpacity
        style={[styles.seatBox, seatStyle]}
        disabled={isBooked}
        onPress={() => handleSeatPress(seatNumber)}
      >
        <Text style={[styles.seatText, textStyle]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LiquidBackground>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-white tracking-tight">Select Seats</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={20} color="#2F80ED" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row bg-[rgba(255,255,255,0.1)] rounded-xl p-1 mb-5 border border-[rgba(255,255,255,0.2)]">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg shadow-sm border ${bookingType === "Single" ? 'bg-[#3b82f6] border-[#2563eb] shadow-blue-500/50' : 'bg-transparent border-transparent shadow-transparent'}`}
            onPress={() => handleTypeChange("Single")}
          >
            <Text className={`font-bold ${bookingType === "Single" ? 'text-white' : 'text-slate-300'}`}>
              Single (1 Seat)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg shadow-sm border ${bookingType === "Family" ? 'bg-[#3b82f6] border-[#2563eb] shadow-blue-500/50' : 'bg-transparent border-transparent shadow-transparent'}`}
            onPress={() => handleTypeChange("Family")}
          >
            <Text className={`font-bold ${bookingType === "Family" ? 'text-white' : 'text-slate-300'}`}>
              Family (Up to 8)
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mb-6 bg-[rgba(255,255,255,0.8)] p-4 rounded-2xl border border-[rgba(255,255,255,0.6)] shadow-sm">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full border border-[#3B82F6] mr-2 bg-[#DBEAFE]" />
            <Text className="text-xs text-[#1E3A8A] font-bold uppercase tracking-widest">Available</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-[#059669] mr-2 shadow-sm border border-[#065F46]" />
            <Text className="text-xs text-[#059669] font-bold uppercase tracking-widest">Selected</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-[#DC2626] mr-2 border border-[#7F1D1D]" />
            <Text className="text-xs text-[#DC2626] font-bold uppercase tracking-widest">Booked</Text>
          </View>
        </View>

        <View className="items-center mb-6">
          <View className="w-full max-w-[400px] bg-[rgba(255,255,255,0.7)] rounded-[40px] border-[4px] border-[rgba(255,255,255,0.9)] p-5 pt-8 shadow-sm">
            <View className="items-end mb-8 pr-3 border-b-2 border-[#CBD5E1] pb-5">
              <View className="w-12 h-12 bg-slate-200 rounded-full justify-center items-center border border-slate-300 shadow-sm">
                <Text className="text-xl">👨‍✈️</Text>
              </View>
            </View>
            
            <View className="pb-5">
              {rows.map((item, index) => (
                <View key={index} className="flex-row justify-center mb-4">
                  <View className="flex-row gap-3">
                    {renderSeat(item[0])}
                    {renderSeat(item[1])}
                  </View>
                  <View className="w-12" />
                  <View className="flex-row gap-3">
                    {renderSeat(item[2])}
                    {renderSeat(item[3])}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <GlassCard className="flex-row justify-between items-center mb-10">
          <Text className="text-base font-bold text-slate-200">
            Selected: <Text className="text-white font-black text-xl">{selectedSeats.length}</Text> <Text className="text-slate-400">/ {bookingType === "Single" ? 1 : 8}</Text>
          </Text>
          <View className="flex-1 ml-4 items-end">
            <GlassButton 
              title="Continue"
              onPress={handleContinue}
              style={{ backgroundColor: "#10b981" }}
              className="px-8 border-0"
            />
          </View>
        </GlassCard>
      </ScrollView>
    </LiquidBackground>
  );
};

export default SeatSelectionScreen;

const styles = StyleSheet.create({
  seatBox: {
    width: 48,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
  },
  seatHidden: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  seatAvailable: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  seatSelected: {
    backgroundColor: "#059669",
    borderColor: "#065F46",
  },
  seatBooked: {
    backgroundColor: "#DC2626",
    borderColor: "#7F1D1D",
  },
  seatText: { fontWeight: "800", fontSize: 14 },
  seatTextAvailable: { color: "#1E3A8A" },
  seatTextSelected: { color: "#ffffff" },
  seatTextBooked: { color: "#ffffff" },
});
