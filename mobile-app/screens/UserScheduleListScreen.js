import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const UserScheduleListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter out Cancelled schedules
        const activeSchedules = response.data.filter((s) => s.status !== "Cancelled");
        setSchedules(activeSchedules);
      } catch (error) {
        Alert.alert("Error", "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  const renderItem = ({ item }) => {
    const totalSeats = item.busId?.seatCount || 0;
    const bookedCount = item.bookedSeats?.length || 0;
    const availableSeats = totalSeats - bookedCount;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.routeText}>
            {item.routeId?.startLocation} to {item.routeId?.endLocation}
          </Text>
          <Text style={styles.priceBadge}>LKR {item.routeId?.price}</Text>
        </View>
        <Text style={styles.detailText}>Bus: {item.busId?.busType} ({item.busId?.licenseNumber})</Text>
        <Text style={styles.detailText}>
          Date: {new Date(item.departureDate).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>
          Time: {item.departureTime} - {item.arrivalTime}
        </Text>
        <Text style={[styles.detailText, { fontWeight: "bold", marginTop: 5 }]}>
          Available Seats: {availableSeats} / {totalSeats}
        </Text>

        <TouchableOpacity
          style={[styles.bookBtn, availableSeats === 0 && styles.disabledBtn]}
          disabled={availableSeats === 0}
          onPress={() => navigation.navigate("SeatSelection", { schedule: item })}
        >
          <Text style={styles.btnText}>
            {availableSeats === 0 ? "Sold Out" : "Select Seats"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Trips</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3567e0" style={{ marginTop: 20 }} />
      ) : schedules.length === 0 ? (
        <Text style={styles.emptyText}>No available trips found</Text>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default UserScheduleListScreen;

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
  priceBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: "bold",
    overflow: "hidden",
    marginLeft: 10,
  },
  detailText: { fontSize: 14, color: "#475569", marginBottom: 5 },
  bookBtn: {
    backgroundColor: "#1cab4c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  disabledBtn: { backgroundColor: "#94a3b8" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 20 },
});
