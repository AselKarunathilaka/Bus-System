import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const BusListScreen = ({ navigation }) => {
  const { token, user, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/buses", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setBuses(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch buses");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchBuses);
    return unsubscribe;
  }, [navigation, fetchBuses]);

  const handleDeleteBus = async (id) => {
    try {
      await api.delete(`/buses/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      fetchBuses();
    } catch (error) {
      Alert.alert("Error", "Delete failed");
    }
  };

  const totalBuses = buses.length;

  const assignedCount = useMemo(
    () => buses.filter((b) => b.assignedRoute).length,
    [buses]
  );

  const activeCount = useMemo(
    () => buses.filter((b) => b.status === "Available").length,
    [buses]
  );

  const maintenanceCount = useMemo(
    () => buses.filter((b) => b.status === "Maintenance").length,
    [buses]
  );

  const inactiveCount = useMemo(
    () => buses.filter((b) => b.status === "Inactive").length,
    [buses]
  );

  const getStatusStyle = (status) => {
    if (status === "Available") return styles.availableBadge;
    if (status === "Maintenance") return styles.maintenanceBadge;
    if (status === "Inactive") return styles.inactiveBadge;
    return styles.neutralBadge;
  };

  const renderBus = ({ item }) => (
    <View style={styles.busCard}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.busName}>{item.busName}</Text>
          <Text style={styles.licenseText}>{item.licenseNumber}</Text>
        </View>

        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>Bus Type: {item.busType}</Text>
        <Text style={styles.detailText}>Seats: {item.seatCount}</Text>
        <Text style={styles.detailText}>Contact: {item.busContactNumber}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailText}>Driver: {item.driverName}</Text>
        <Text style={styles.detailText}>Driver NIC: {item.driverNIC}</Text>
        <Text style={styles.detailText}>Conductor: {item.conductorName}</Text>
        <Text style={styles.detailText}>Conductor NIC: {item.conductorNIC}</Text>
      </View>

      <View style={styles.routeBox}>
        <Text style={styles.routeText}>
          {item.assignedRoute
            ? `Route: ${item.assignedRoute.routeName}\n${item.assignedRoute.startLocation} → ${item.assignedRoute.endLocation}`
            : "Route: Not Assigned"}
        </Text>
      </View>

      {isAdmin && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("BusForm", { busData: item })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteBus(item._id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading buses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topPanel}>
        <Text style={styles.panelTitle}>
          {isAdmin ? "Bus Dashboard" : "Available Buses"}
        </Text>

        <Text style={styles.panelSubtitle}>
          {isAdmin
            ? "View total buses, assigned buses, active buses, maintenance buses, and inactive buses."
            : "These are the buses available in the system."}
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalBuses}</Text>
            <Text style={styles.statLabel}>Total Buses</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{assignedCount}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{maintenanceCount}</Text>
            <Text style={styles.statLabel}>Maintenance</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{inactiveCount}</Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("BusForm")}
          >
            <Text style={styles.addButtonText}>+ Add Bus</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={buses}
        keyExtractor={(item) => item._id}
        renderItem={renderBus}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No buses found.</Text>
        }
      />
    </View>
  );
};

export default BusListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#475569",
    fontWeight: "600",
  },

  topPanel: {
    backgroundColor: "#0f172a",
    margin: 12,
    padding: 16,
    borderRadius: 16,
  },

  panelTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },

  panelSubtitle: {
    color: "#cbd5e1",
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    gap: 8,
  },

  statCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minWidth: "31%",
    flexGrow: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },

  addButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },

  addButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  busCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  busName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },

  licenseText: {
    color: "#64748b",
    fontWeight: "700",
    marginTop: 3,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    color: "#0f172a",
    fontWeight: "800",
    fontSize: 12,
  },

  availableBadge: {
    backgroundColor: "#dcfce7",
  },

  maintenanceBadge: {
    backgroundColor: "#ffedd5",
  },

  inactiveBadge: {
    backgroundColor: "#fee2e2",
  },

  neutralBadge: {
    backgroundColor: "#e2e8f0",
  },

  detailsBox: {
    marginTop: 6,
  },

  detailText: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600",
  },

  routeBox: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },

  routeText: {
    color: "#0f172a",
    fontWeight: "700",
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  editButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
  },

  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 20,
    fontWeight: "700",
  },
});