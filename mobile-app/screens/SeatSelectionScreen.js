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
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">Select Seats</Text>
        </View>
        
        <View className="flex-row bg-black/5 rounded-xl p-1 mb-5 border border-black/10">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${bookingType === "Single" ? 'bg-white shadow-sm border border-black/5' : ''}`}
            onPress={() => handleTypeChange("Single")}
          >
            <Text className={`font-bold ${bookingType === "Single" ? 'text-slate-900' : 'text-slate-500'}`}>
              Single (1 Seat)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${bookingType === "Family" ? 'bg-white shadow-sm border border-black/5' : ''}`}
            onPress={() => handleTypeChange("Family")}
          >
            <Text className={`font-bold ${bookingType === "Family" ? 'text-slate-900' : 'text-slate-500'}`}>
              Family (Up to 8)
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mb-6 bg-black/5 p-3 rounded-xl border border-black/5">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded border-2 border-slate-400 mr-2" />
            <Text className="text-xs text-slate-600 font-bold uppercase">Available</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded bg-[#007AFF] mr-2" />
            <Text className="text-xs text-slate-600 font-bold uppercase">Selected</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded bg-slate-300 mr-2" />
            <Text className="text-xs text-slate-600 font-bold uppercase">Booked</Text>
          </View>
        </View>

        <View className="items-center mb-6">
          <View className="w-full max-w-[400px] bg-white rounded-[40px] border-[6px] border-slate-200 p-5 pt-8 shadow-sm">
            <View className="items-end mb-8 pr-3 border-b-2 border-slate-100 pb-5">
              <View className="w-12 h-12 bg-slate-100 rounded-full justify-center items-center border-2 border-slate-200">
                <Text className="text-xl">🚍</Text>
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
          <Text className="text-base font-bold text-slate-900">
            Selected: <Text className="text-[#007AFF]">{selectedSeats.length}</Text> / {bookingType === "Single" ? 1 : 8}
          </Text>
          <TouchableOpacity 
            className="bg-[#007AFF] px-6 py-3 rounded-xl shadow-sm"
            onPress={handleContinue}
          >
            <Text className="color-white font-black text-sm uppercase">Continue</Text>
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>
    </LiquidBackground>
  );
};

export default SeatSelectionScreen;

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
    backgroundColor: "#ffffff",
    borderColor: "#94a3b8",
  },
  seatSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  seatBooked: {
    backgroundColor: "#e2e8f0",
    borderColor: "#cbd5e1",
  },
  seatText: { fontWeight: "800", fontSize: 14 },
  seatTextAvailable: { color: "#64748b" },
  seatTextSelected: { color: "#ffffff" },
  seatTextBooked: { color: "#94a3b8" },
});
