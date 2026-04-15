import React, { useContext, useEffect, useState, useCallback } from "react";
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
import { AuthContext } from "../context/AuthContext";

const StopListScreen = ({ route, navigation }) => {
  const { token, user, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const { routeId, routeName } = route.params;
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStops = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get(`/stops/route/${routeId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setStops(response.data);
    } catch (error) {
      console.log("Fetch stops error:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch stops"
      );
    } finally {
      setLoading(false);
    }
  }, [routeId, authToken]);

  const handleDeleteStop = async (stopId) => {
    const doDelete = async () => {
      try {
        console.log("Deleting stop:", stopId);

        await api.delete(`/stops/${stopId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        Alert.alert("Success", "Stop deleted successfully");
        fetchStops();
      } catch (error) {
        console.log("Delete stop error:", error?.response?.data || error.message);
        Alert.alert(
          "Error",
          error?.response?.data?.message || "Failed to delete stop"
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this stop?"
      );
      if (confirmed) {
        await doDelete();
      }
    } else {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this stop?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: doDelete,
        },
      ]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchStops);
    return unsubscribe;
  }, [navigation, fetchStops]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loaderText}>Loading stops...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routeName} Stops</Text>
      <Text style={styles.subtitle}>
        {user?.role === "admin"
          ? "Add, edit, and remove stops for this route"
          : "View all stops available in this route"}
      </Text>

      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("StopForm", { routeId })}
        >
          <Text style={styles.buttonText}>Add Stop</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={stops}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No stops found for this route</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.stopName}>
              {item.order}. {item.stopName}
            </Text>
            <Text style={styles.text}>Location: {item.location}</Text>

            {user?.role === "admin" && (
              <>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("StopForm", {
                      routeId,
                      stopData: item,
                    })
                  }
                >
                  <Text style={styles.buttonText}>Edit Stop</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteStop(item._id)}
                >
                  <Text style={styles.buttonText}>Delete Stop</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default StopListScreen;

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
    marginBottom: 8,
    color: "#0f172a",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#475569",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
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
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stopName: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    color: "#0f172a",
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    color: "#475569",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});