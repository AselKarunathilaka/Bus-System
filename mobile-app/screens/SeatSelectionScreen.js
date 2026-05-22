import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

const SeatSelectionScreen = ({ route, navigation }) => {
  const { schedule } = route.params;
  const totalSeats = schedule.busId?.seatCount || 0;
  const bookedSeats = schedule.bookedSeats || [];

  const [bookingType, setBookingType] = useState("Single"); // 'Single' or 'Family'
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Generate an array from 1 to totalSeats
  const seatsData = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const handleSeatPress = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;

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

  const renderSeat = ({ item }) => {
    const isBooked = bookedSeats.includes(item);
    const isSelected = selectedSeats.includes(item);

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
        onPress={() => handleSeatPress(item)}
      >
        <Text style={[styles.seatText, textStyle]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Seats</Text>
      
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeBtn, bookingType === "Single" && styles.typeBtnActive]}
          onPress={() => handleTypeChange("Single")}
        >
          <Text style={[styles.typeBtnText, bookingType === "Single" && styles.typeBtnTextActive]}>
            Single (1 Seat)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, bookingType === "Family" && styles.typeBtnActive]}
          onPress={() => handleTypeChange("Family")}
        >
          <Text style={[styles.typeBtnText, bookingType === "Family" && styles.typeBtnTextActive]}>
            Family (Up to 8)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.seatAvailable]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.seatSelected]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.seatBooked]} />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <FlatList
          data={seatsData}
          keyExtractor={(item) => item.toString()}
          numColumns={4}
          renderItem={renderSeat}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.selectedCountText}>
          Selected: {selectedSeats.length} / {bookingType === "Single" ? 1 : 8}
        </Text>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue to Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SeatSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef4ff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  typeBtnActive: { backgroundColor: "#3567e0" },
  typeBtnText: { fontWeight: "bold", color: "#64748b" },
  typeBtnTextActive: { color: "#fff" },
  
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendBox: { width: 20, height: 20, borderRadius: 4, marginRight: 5 },
  legendText: { fontSize: 12, color: "#334155" },

  gridContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    elevation: 2,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  seatBox: {
    width: "20%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
  },
  seatAvailable: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
  },
  seatSelected: {
    backgroundColor: "#1cab4c",
    borderColor: "#166534",
  },
  seatBooked: {
    backgroundColor: "#e2e8f0",
    borderColor: "#94a3b8",
  },
  seatText: { fontWeight: "bold" },
  seatTextAvailable: { color: "#334155" },
  seatTextSelected: { color: "#ffffff" },
  seatTextBooked: { color: "#94a3b8" },

  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCountText: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  continueBtn: {
    backgroundColor: "#3567e0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
