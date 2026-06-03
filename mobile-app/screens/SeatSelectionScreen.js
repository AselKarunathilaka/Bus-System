import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
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
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Select Seats</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View className="flex-row bg-slate-100 rounded-xl p-1 mb-6 border border-slate-200">
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${bookingType === "Single" ? 'bg-primary border border-blue-400' : 'bg-transparent border border-transparent'}`}
            onPress={() => handleTypeChange("Single")}
          >
            <Text className={`font-bold ${bookingType === "Single" ? 'text-white' : 'text-textMuted'}`}>
              Single (1 Seat)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 items-center rounded-lg ${bookingType === "Family" ? 'bg-primary border border-blue-400' : 'bg-transparent border border-transparent'}`}
            onPress={() => handleTypeChange("Family")}
          >
            <Text className={`font-bold ${bookingType === "Family" ? 'text-white' : 'text-textMuted'}`}>
              Family (Up to 8)
            </Text>
          </TouchableOpacity>
        </View>

        <AppCard className="mb-6 flex-row justify-around items-center p-4">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full border border-blue-500 mr-2 bg-blue-100" />
            <Text className="text-[10px] text-blue-700 font-bold uppercase tracking-widest">Available</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-emerald-500 mr-2 border border-emerald-600" />
            <Text className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Selected</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-red-500 mr-2 border border-red-700" />
            <Text className="text-[10px] text-red-700 font-bold uppercase tracking-widest">Booked</Text>
          </View>
        </AppCard>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}>
          <View className="w-full max-w-[360px] bg-white rounded-[40px] border-4 border-slate-200 p-5 pt-8 mb-6">
            <View className="items-end mb-8 pr-3 border-b-2 border-slate-200 pb-5">
              <View className="w-12 h-12 bg-slate-100 rounded-full justify-center items-center border border-slate-200">
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
        </ScrollView>

        <View className="absolute bottom-6 left-6 right-6">
          <AppCard className="flex-row justify-between items-center border border-border">
            <Text className="text-sm font-bold text-textMuted">
              Selected: <Text className="text-primary font-black text-xl">{selectedSeats.length}</Text> <Text className="text-slate-400">/ {bookingType === "Single" ? 1 : 8}</Text>
            </Text>
            <View className="w-1/2 ml-4">
              <AppButton 
                title="Continue"
                onPress={handleContinue}
                variant="primary"
              />
            </View>
          </AppCard>
        </View>
      </View>
    </AppLayout>
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
    backgroundColor: "#DBEAFE", // blue-100
    borderColor: "#3B82F6", // blue-500
  },
  seatSelected: {
    backgroundColor: "#10B981", // emerald-500
    borderColor: "#059669", // emerald-600
  },
  seatBooked: {
    backgroundColor: "#EF4444", // red-500
    borderColor: "#B91C1C", // red-700
  },
  seatText: { fontWeight: "800", fontSize: 14 },
  seatTextAvailable: { color: "#1E3A8A" }, // blue-900
  seatTextSelected: { color: "#ffffff" },
  seatTextBooked: { color: "#ffffff" },
});
