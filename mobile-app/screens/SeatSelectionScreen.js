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
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white shadow-sm tracking-tight">Select Seats</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-white/10 p-2 rounded-full border border-white/10">
            <Ionicons name="home" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row bg-white/10 rounded-xl p-1 mb-5 border border-white/10">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${bookingType === "Single" ? 'bg-[#38bdf8]/20 shadow-sm border border-[#38bdf8]/30' : ''}`}
            onPress={() => handleTypeChange("Single")}
          >
            <Text className={`font-bold ${bookingType === "Single" ? 'text-white' : 'text-slate-400'}`}>
              Single (1 Seat)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${bookingType === "Family" ? 'bg-[#38bdf8]/20 shadow-sm border border-[#38bdf8]/30' : ''}`}
            onPress={() => handleTypeChange("Family")}
          >
            <Text className={`font-bold ${bookingType === "Family" ? 'text-white' : 'text-slate-400'}`}>
              Family (Up to 8)
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mb-6 bg-white/10 p-4 rounded-2xl border border-white/10 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full border-2 border-white/40 mr-2" />
            <Text className="text-xs text-slate-300 font-bold uppercase tracking-widest">Available</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-[#10b981] mr-2 shadow-sm shadow-[#10b981]/50" />
            <Text className="text-xs text-[#10b981] font-bold uppercase tracking-widest">Selected</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-red-600/60 mr-2 border border-red-500/30" />
            <Text className="text-xs text-red-500 font-bold uppercase tracking-widest">Booked</Text>
          </View>
        </View>

        <View className="items-center mb-6">
          <View className="w-full max-w-[400px] bg-slate-900/40 rounded-[40px] border-[4px] border-[#38bdf8]/20 p-5 pt-8 shadow-sm">
            <View className="items-end mb-8 pr-3 border-b-2 border-white/5 pb-5">
              <View className="w-12 h-12 bg-emerald-500/10 rounded-full justify-center items-center border border-emerald-500/30">
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
          <Text className="text-base font-bold text-white">
            Selected: <Text className="text-[#38bdf8] font-black text-xl">{selectedSeats.length}</Text> <Text className="text-slate-400">/ {bookingType === "Single" ? 1 : 8}</Text>
          </Text>
          <GlassButton 
            title="Continue"
            onPress={handleContinue}
            className="w-1/2"
          />
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
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  seatSelected: {
    backgroundColor: "#059669",
    borderColor: "#10b981",
  },
  seatBooked: {
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    borderColor: "rgba(220, 38, 38, 0.4)",
  },
  seatText: { fontWeight: "800", fontSize: 14 },
  seatTextAvailable: { color: "#cbd5e1" },
  seatTextSelected: { color: "#ffffff" },
  seatTextBooked: { color: "#dc2626", opacity: 0.6 },
});
