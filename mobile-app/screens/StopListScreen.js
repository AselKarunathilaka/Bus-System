<<<<<<< HEAD
import React, { useContext, useEffect, useState, useCallback } from "react";
=======
import React, { useContext, useEffect, useState } from "react";
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
<<<<<<< HEAD
  ActivityIndicator,
  Platform,
=======
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const StopListScreen = ({ route, navigation }) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch stops"
      );
<<<<<<< HEAD
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
=======
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchStops);
    return unsubscribe;
<<<<<<< HEAD
  }, [navigation, fetchStops]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loaderText}>Loading stops...</Text>
      </View>
    );
  }
=======
  }, [navigation]);
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routeName} Stops</Text>
<<<<<<< HEAD
      <Text style={styles.subtitle}>
        {user?.role === "admin"
          ? "Add, edit, and remove stops for this route"
          : "View all stops available in this route"}
      </Text>
=======
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
<<<<<<< HEAD
          onPress={() => navigation.navigate("StopForm", { routeId })}
=======
          onPress={() => navigation.navigate("AddStop", { routeId })}
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        >
          <Text style={styles.buttonText}>Add Stop</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={stops}
        keyExtractor={(item) => item._id}
<<<<<<< HEAD
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
=======
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
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
<<<<<<< HEAD
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
=======
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
<<<<<<< HEAD
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
=======
    borderRadius: 10,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
<<<<<<< HEAD
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
=======
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
<<<<<<< HEAD
    color: "#475569",
=======
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});