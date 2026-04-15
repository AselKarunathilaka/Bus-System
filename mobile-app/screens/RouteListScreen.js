import React, { useContext, useEffect, useState, useCallback } from "react";
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

const RouteListScreen = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/routes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoutes(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch routes"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleDeleteRoute = async (routeId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this route?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/routes/${routeId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            Alert.alert("Success", "Route deleted successfully");
            fetchRoutes();
          } catch (error) {
            Alert.alert(
              "Error",
              error?.response?.data?.message || "Failed to delete route"
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRoutes);
    return unsubscribe;
  }, [navigation, fetchRoutes]);

  const renderStopsPreview = (stops = []) => {
    if (!stops.length) {
      return <Text style={styles.subText}>No stops added yet</Text>;
    }

    return (
      <View style={styles.stopContainer}>
        {stops.map((stop) => (
          <Text key={stop._id} style={styles.stopText}>
            • {stop.order}. {stop.stopName} - {stop.location}
          </Text>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loaderText}>Loading routes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {user?.role === "admin" ? "Manage Routes" : "Available Routes"}
      </Text>

      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("RouteForm")}
        >
          <Text style={styles.buttonText}>Add Route</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={routes}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No routes found</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.routeName}>{item.routeName}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  item.status === "active" ? styles.activeBadge : styles.inactiveBadge,
                ]}
              >
                {item.status}
              </Text>
            </View>

            <Text style={styles.routePath}>
              {item.startLocation} → {item.endLocation}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Price: LKR {item.price}</Text>
              <Text style={styles.infoText}>Distance: {item.distanceKm} km</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Duration: {item.estimatedDuration}</Text>
              <Text style={styles.infoText}>Stops: {item.stopCount || 0}</Text>
            </View>

            {!!item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}

            <Text style={styles.sectionTitle}>Stops</Text>
            {renderStopsPreview(item.stops)}

            <TouchableOpacity
              style={styles.stopButton}
              onPress={() =>
                navigation.navigate("StopList", {
                  routeId: item._id,
                  routeName: item.routeName,
                })
              }
            >
              <Text style={styles.buttonText}>View Full Stop Details</Text>
            </TouchableOpacity>

            {user?.role === "admin" && (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("RouteForm", {
                      routeData: item,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Edit Route</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRoute(item._id)}
                >
                  <Text style={styles.buttonText}>Delete Route</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default RouteListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eef4ff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef4ff",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#475569",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  stopButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    flex: 1,
    paddingRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  activeBadge: {
    backgroundColor: "#16a34a",
  },
  inactiveBadge: {
    backgroundColor: "#64748b",
  },
  routePath: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  description: {
    marginTop: 10,
    color: "#475569",
    lineHeight: 20,
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: "700",
    fontSize: 15,
    color: "#0f172a",
  },
  stopContainer: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
  },
  stopText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 4,
  },
  subText: {
    color: "#64748b",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});