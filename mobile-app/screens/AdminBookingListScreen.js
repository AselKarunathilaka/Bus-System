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

    }
  };

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  const renderItem = ({ item }) => {
    const formattedSeats = item.seatNumbers?.map(getSeatLabel).join(", ") || "";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.userName}>{item.userId?.fullName || "Unknown User"}</Text>
            <Text style={styles.bookingIdText}>ID: {item.bookingId || "N/A"}</Text>
          </View>
          <Text style={[styles.statusBadge, item.status === 'Cancelled' && styles.statusCancelled]}>
            {item.status}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Route:</Text>
            <Text style={styles.detailValue}>
              {item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bus:</Text>
            <Text style={styles.detailValue}>
              {item.scheduleId?.busId?.busName} ({item.scheduleId?.busId?.licenseNumber})
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seats:</Text>
            <Text style={styles.detailValue}>{formattedSeats} ({item.bookingType})</Text>
          </View>
          {item.contactNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contact:</Text>
              <Text style={styles.detailValue}>{item.contactNumber}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booked On:</Text>
            <Text style={styles.detailValue}>{new Date(item.bookingDate).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>LKR {item.totalPrice}</Text>
          <View style={styles.actionGroup}>
            {item.status !== "Cancelled" && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => handleCancel(item._id)}
              >
                <Text style={[styles.btnText, styles.cancelBtnText]}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={() => handleDelete(item._id)}
            >
              <Text style={[styles.btnText, styles.deleteBtnText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "900", color: "#0f172a", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 15,
  },
  userName: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  bookingIdText: { fontSize: 13, color: "#64748b", marginTop: 4, fontWeight: "600" },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  statusCancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 15,
  },
  priceText: { fontSize: 18, fontWeight: "900", color: "#3567e0" },
  actionGroup: {
    flexDirection: "row",
  },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  cancelBtn: { backgroundColor: "#fef3c7" },
  cancelBtnText: { color: "#d97706" },
  deleteBtn: { backgroundColor: "#fee2e2" },
  deleteBtnText: { color: "#ef4444" },
  btnText: { fontWeight: "bold", fontSize: 13 },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 40, fontSize: 16 },
});
