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

      <View style={styles.busContainerWrapper}>
        <View style={styles.busContainer}>
          <View style={styles.driverSection}>
            <View style={styles.steeringWheel}>
              <Text style={styles.driverIcon}>🚍</Text>
            </View>
          </View>
          
          <FlatList
            data={rows}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            renderItem={({ item }) => (
              <View style={styles.busRow}>
                <View style={styles.seatPair}>
                  {renderSeat(item[0])}
                  {renderSeat(item[1])}
                </View>
                <View style={styles.aisle} />
                <View style={styles.seatPair}>
                  {renderSeat(item[2])}
                  {renderSeat(item[3])}
                </View>
              </View>
            )}
          />
        </View>
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
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  title: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 15, textAlign: "center" },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  typeBtnActive: { backgroundColor: "#3567e0" },
  typeBtnText: { fontWeight: "bold", color: "#94a3b8" },
  typeBtnTextActive: { color: "#fff" },
  
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 10,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendBox: { width: 16, height: 16, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 13, color: "#cbd5e1", fontWeight: "600" },

  busContainerWrapper: {
    flex: 1,
    alignItems: "center",
    marginBottom: 15,
  },
  busContainer: {
    width: "100%",
    maxWidth: 400,
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#334155",
    padding: 15,
    paddingTop: 20,
  },
  driverSection: {
    alignItems: "flex-end",
    marginBottom: 25,
    paddingRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#334155",
    paddingBottom: 15,
  },
  steeringWheel: {
    width: 40,
    height: 40,
    backgroundColor: "#0f172a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#475569",
  },
  driverIcon: { fontSize: 18 },
  flatListContent: { paddingBottom: 20 },
  busRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  seatPair: {
    flexDirection: "row",
    gap: 10,
  },
  aisle: {
    width: 40, // Aisle width
  },
  seatBox: {
    width: 45,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  seatHidden: {
    backgroundColor: "transparent",
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  seatAvailable: {
    backgroundColor: "transparent",
    borderColor: "#64748b",
    borderWidth: 1.5,
  },
  seatSelected: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },
  seatBooked: {
    backgroundColor: "#ef4444",
    borderColor: "#b91c1c",
  },
  seatText: { fontWeight: "700", fontSize: 14 },
  seatTextAvailable: { color: "#cbd5e1" },
  seatTextSelected: { color: "#ffffff" },
  seatTextBooked: { color: "#fca5a5" },

  footer: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCountText: { fontSize: 16, fontWeight: "bold", color: "#f8fafc" },
  continueBtn: {
    backgroundColor: "#3567e0",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  continueBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
