import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ScheduleListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(response.data);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchSchedules();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this schedule?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/schedules/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Success", "Schedule deleted successfully");
            fetchSchedules();
          } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Failed to delete schedule");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.routeText}>
          {item.routeId?.startLocation} to {item.routeId?.endLocation}
        </Text>
        <Text style={styles.statusBadge}>{item.status}</Text>
      </View>
      <Text style={styles.detailText}>Bus: {item.busId?.licenseNumber}</Text>
      <Text style={styles.detailText}>
        Date: {new Date(item.departureDate).toLocaleDateString()}
      </Text>
      <Text style={styles.detailText}>
        Time: {item.departureTime} - {item.arrivalTime}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate("ScheduleForm", { schedule: item })}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
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
      <Text style={styles.title}>Manage Schedules</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("ScheduleForm")}
      >
        <Text style={styles.addButtonText}>+ Add New Schedule</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#3567e0" style={{ marginTop: 20 }} />
      ) : schedules.length === 0 ? (
        <Text style={styles.emptyText}>No schedules found</Text>
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

export default ScheduleListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#eef4ff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  addButton: {
    backgroundColor: "#1cab4c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  routeText: { fontSize: 16, fontWeight: "bold" },
  statusBadge: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  detailText: { fontSize: 14, color: "#475569", marginBottom: 5 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionBtn: { padding: 10, borderRadius: 8, marginLeft: 10 },
  editBtn: { backgroundColor: "#3567e0" },
  deleteBtn: { backgroundColor: "#ea2424" },
  btnText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#64748b", marginTop: 20 },
});
