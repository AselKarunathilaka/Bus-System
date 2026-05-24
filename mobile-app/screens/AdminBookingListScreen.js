import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const AdminBookingListScreen = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    const executeCancel = async () => {
      try {
        await api.delete(`/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === "web") window.alert("Booking cancelled successfully.");
        else Alert.alert("Success", "Booking cancelled successfully.");
        
        // Refresh bookings
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
        );
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to cancel booking.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Error", msg);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to cancel this booking?")) executeCancel();
    } else {
      Alert.alert("Cancel", "Are you sure you want to cancel this booking?", [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: executeCancel },
      ]);
    }
  };

  const handleDelete = async (bookingId) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/bookings/admin/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === "web") window.alert("Booking deleted permanently.");
        else Alert.alert("Success", "Booking deleted permanently.");
        
        // Refresh bookings
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete booking.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Error", msg);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Permanently delete this booking record?")) executeDelete();
    } else {
      Alert.alert("Delete", "Permanently delete this booking record?", [
        { text: "No", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: executeDelete },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userName}>{item.userId?.fullName || "Unknown User"}</Text>
        <Text style={[styles.statusBadge, item.status === 'Cancelled' && styles.statusCancelled]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.detailText}>
        Route: {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
      </Text>
      <Text style={styles.detailText}>
        Bus: {item.scheduleId?.busId?.licenseNumber}
      </Text>
      <Text style={styles.detailText}>
        Seats: {item.seatNumbers.join(", ")} ({item.bookingType})
      </Text>
      <Text style={styles.priceText}>Total: LKR {item.totalPrice}</Text>
      <Text style={styles.dateText}>
        Booked On: {new Date(item.bookingDate).toLocaleDateString()}
      </Text>
      
      <View style={styles.actionRow}>
        {item.status !== "Cancelled" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => handleCancel(item._id)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Bookings</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3567e0" style={{ marginTop: 20 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>No bookings found</Text>
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

export default AdminBookingListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#eef4ff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  userName: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  detailText: { fontSize: 14, color: "#475569", marginBottom: 3 },
  priceText: { fontSize: 14, fontWeight: "bold", color: "#3567e0", marginTop: 5 },
  dateText: { fontSize: 12, color: "#94a3b8", marginTop: 5 },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 20 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, marginLeft: 10 },
  cancelBtn: { backgroundColor: "#f59e0b" },
  deleteBtn: { backgroundColor: "#ea2424" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});
