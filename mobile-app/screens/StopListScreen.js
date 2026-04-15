import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const StopListScreen = ({ route, navigation }) => {
  const { token, user } = useContext(AuthContext);
  const { routeId, routeName } = route.params;
  const [stops, setStops] = useState([]);

  const fetchStops = async () => {
    try {
      const response = await api.get(`/stops/route/${routeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStops(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch stops"
      );
    }
  };

  const handleDeleteStop = async (stopId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this stop?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/stops/${stopId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            Alert.alert("Success", "Stop deleted successfully");
            fetchStops();
          } catch (error) {
            Alert.alert(
              "Error",
              error?.response?.data?.message || "Failed to delete stop"
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchStops);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routeName} Stops</Text>

      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddStop", { routeId })}
        >
          <Text style={styles.buttonText}>Add Stop</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={stops}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No stops found</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.stopName}>{item.stopName}</Text>
            <Text style={styles.text}>Location: {item.location}</Text>
            <Text style={styles.text}>Order: {item.order}</Text>

            {user?.role === "admin" && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteStop(item._id)}
              >
                <Text style={styles.buttonText}>Delete Stop</Text>
              </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
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
    fontWeight: "600",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  stopName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});