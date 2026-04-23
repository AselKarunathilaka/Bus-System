import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../services/api";

export default function BusListScreen() {
  const navigation = useNavigation();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchBuses = async () => {
    try {
      setLoading(true);

      const response =
        filter === "AVAILABLE"
          ? await api.get("/buses/available/list")
          : await api.get("/buses");

      setBuses(response.data || []);
    } catch (error) {
      console.log("Fetch buses error:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to load buses");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBuses();
    }, [filter])
  );

  const handleDelete = (id) => {
    Alert.alert("Delete Bus", "Are you sure you want to delete this bus?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/buses/${id}`);
            Alert.alert("Success", "Bus deleted successfully");
            fetchBuses();
          } catch (error) {
            console.log("Delete bus error:", error?.response?.data || error.message);
            Alert.alert("Error", "Failed to delete bus");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.busName}>{item.busName}</Text>
      <Text style={styles.text}>License No: {item.licenseNumber}</Text>
      <Text style={styles.text}>Bus Type: {item.busType}</Text>
      <Text style={styles.text}>Seats: {item.totalSeats}</Text>
      <Text style={styles.text}>Driver: {item.driverName}</Text>
      <Text style={styles.text}>Conductor: {item.conductorName}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
      {item.assignedRoute && (
        <Text style={styles.text}>
          Assigned Route: {item.assignedRoute.routeName || item.assignedRoute._id}
        </Text>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate("BusForm", { bus: item })}
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Management</Text>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "ALL" && styles.activeFilter]}
          onPress={() => setFilter("ALL")}
        >
          <Text
            style={[styles.filterText, filter === "ALL" && styles.activeFilterText]}
          >
            All Buses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "AVAILABLE" && styles.activeFilter]}
          onPress={() => setFilter("AVAILABLE")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "AVAILABLE" && styles.activeFilterText,
            ]}
          >
            Available
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("BusForm")}
      >
        <Text style={styles.addButtonText}>+ Add New Bus</Text>
      </TouchableOpacity>

      <FlatList
        data={buses}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No buses found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1e293b",
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#4f46e5",
  },
  filterText: {
    color: "#1e293b",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  busName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0f172a",
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
    color: "#334155",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#f59e0b",
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});