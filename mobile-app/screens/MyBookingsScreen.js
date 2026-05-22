import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const MyBookingsScreen = () => {
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
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/bookings/${bookingId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Success", "Booking cancelled successfully.");
            fetchBookings();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to cancel booking.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.routeText}>
          {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
        </Text>
        <Text style={[styles.statusBadge, item.status === 'Cancelled' && styles.statusCancelled]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.detailText}>
        Bus: {item.scheduleId?.busId?.busName} ({item.scheduleId?.busId?.licenseNumber})
      </Text>
      <Text style={styles.detailText}>
        Date: {new Date(item.scheduleId?.departureDate).toLocaleDateString()} at {item.scheduleId?.departureTime}
      </Text>
      <Text style={styles.detailText}>
        Seats: {item.seatNumbers.join(", ")} ({item.bookingType})
      </Text>
      <Text style={styles.priceText}>Total Paid: LKR {item.totalPrice}</Text>
      
      {item.status !== "Cancelled" && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => handleCancel(item._id)}
        >
          <Text style={styles.cancelBtnText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3567e0" style={{ marginTop: 20 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>You haven't made any bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default MyBookingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#eef4ff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  routeText: { fontSize: 16, fontWeight: "bold", flex: 1 },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
    marginLeft: 10,
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  detailText: { fontSize: 14, color: "#475569", marginBottom: 5 },
  priceText: { fontSize: 15, fontWeight: "bold", color: "#3567e0", marginTop: 5 },
  cancelBtn: {
    marginTop: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ea2424",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelBtnText: { color: "#ea2424", fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 20 },
});
