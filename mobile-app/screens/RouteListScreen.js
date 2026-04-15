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

const RouteListScreen = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    try {
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
    }
  };

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
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes</Text>

      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddRoute")}
        >
          <Text style={styles.buttonText}>Add Route</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={routes}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>No routes found</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.routeName}>{item.routeName}</Text>
            <Text style={styles.text}>
              {item.startLocation} → {item.endLocation}
            </Text>
            <Text style={styles.text}>Price: LKR {item.price}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={() =>
                navigation.navigate("StopList", {
                  routeId: item._id,
                  routeName: item.routeName,
                })
              }
            >
              <Text style={styles.buttonText}>View Stops</Text>
            </TouchableOpacity>

            {user?.role === "admin" && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRoute(item._id)}
              >
                <Text style={styles.buttonText}>Delete Route</Text>
              </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
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
  stopButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
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
  routeName: {
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