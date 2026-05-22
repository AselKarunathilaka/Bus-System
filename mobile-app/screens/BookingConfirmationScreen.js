import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { schedule, selectedSeats, bookingType } = route.params;
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const basePrice = schedule.routeId?.price || 0;
  const totalPrice = basePrice * selectedSeats.length;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        scheduleId: schedule._id,
        seatNumbers: selectedSeats,
        bookingType,
        totalPrice,
      };

      await api.post("/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Booking confirmed successfully!", [
        {
          text: "View My Bookings",
          onPress: () => navigation.navigate("MyBookings"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Booking</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Journey Details</Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Route:</Text> {schedule.routeId?.startLocation} to {schedule.routeId?.endLocation}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Bus:</Text> {schedule.busId?.busName} ({schedule.busId?.licenseNumber})
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Date:</Text> {new Date(schedule.departureDate).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Time:</Text> {schedule.departureTime} - {schedule.arrivalTime}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ticket Details</Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Booking Type:</Text> {bookingType}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Selected Seats:</Text> {selectedSeats.join(", ")}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>Seat Count:</Text> {selectedSeats.length}
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.totalLabel}>Total Amount to Pay</Text>
        <Text style={styles.totalPrice}>LKR {totalPrice}</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={handleConfirm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmBtnText}>Confirm & Pay</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#eef4ff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#0f172a" },
  detailText: { fontSize: 15, color: "#334155", marginBottom: 5 },
  bold: { fontWeight: "bold", color: "#0f172a" },
  
  summaryCard: {
    backgroundColor: "#1e3a8a",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: { color: "#cbd5e1", fontSize: 16, marginBottom: 5 },
  totalPrice: { color: "#fff", fontSize: 28, fontWeight: "bold" },

  confirmBtn: {
    backgroundColor: "#1cab4c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
