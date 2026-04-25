import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import api from "../services/api";

const BusListScreen = ({ navigation }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);

      const response =
        filter === "AVAILABLE"
          ? await api.get("/buses/available/list")
          : await api.get("/buses");

      setBuses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Fetch buses error:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load buses"
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchBuses);
    return unsubscribe;
  }, [navigation, fetchBuses]);

  const handleDelete = async (id) => {
    const deleteBus = async () => {
      try {
        await api.delete(`/buses/${id}`);
        Alert.alert("Success", "Bus deleted successfully");
        fetchBuses();
      } catch (error) {
        console.log("Delete bus error:", error?.response?.data || error.message);
        Alert.alert(
          "Error",
          error?.response?.data?.message || "Failed to delete bus"
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this bus?");
      if (confirmed) deleteBus();
    } else {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this bus?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteBus },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading buses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Management</Text>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "ALL" && styles.activeFilter]}
          onPress={() => setFilter("ALL")}
        >
          <Text style={styles.buttonText}>All Buses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "AVAILABLE" && styles.activeFilter,
          ]}
          onPress={() => setFilter("AVAILABLE")}
        >
          <Text style={styles.buttonText}>Available</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("BusForm")}
      >
        <Text style={styles.buttonText}>Add Bus</Text>
      </TouchableOpacity>

      <FlatList
        data={buses}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No buses found</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.busName}>{item.busName}</Text>
            <Text>License No: {item.licenseNumber}</Text>
            <Text>Type: {item.busType}</Text>
            <Text>Total Seats: {item.totalSeats}</Text>
            <Text>Driver: {item.driverName}</Text>
            <Text>Conductor: {item.conductorName}</Text>
            <Text>Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("BusForm", { busData: item })}
            >
              <Text style={styles.buttonText}>Edit Bus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id)}
            >
              <Text style={styles.buttonText}>Delete Bus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default BusListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eef4ff",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#64748b",
    padding: 12,
    borderRadius: 10,
  },
  activeFilter: {
    backgroundColor: "#2563eb",
  },
  addButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  busName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  editButton: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});