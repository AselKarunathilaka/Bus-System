<<<<<<< HEAD
import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
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

<<<<<<< HEAD
const PRICE_OPTIONS = [
  { label: "All prices", value: "all" },
  { label: "Less than LKR 500", value: "lt500" },
  { label: "LKR 500 - 1000", value: "500to1000" },
  { label: "LKR 1001 - 2000", value: "1001to2000" },
  { label: "Greater than LKR 2000", value: "gt2000" },
];

const DISTANCE_OPTIONS = [
  { label: "All distances", value: "all" },
  { label: "Less than 50 KM", value: "lt50" },
  { label: "50 KM - 100 KM", value: "50to100" },
  { label: "101 KM - 200 KM", value: "101to200" },
  { label: "Greater than 200 KM", value: "gt200" },
];

const RouteListScreen = ({ navigation }) => {
  const { token, user, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [draftStart, setDraftStart] = useState("all");
  const [draftPrice, setDraftPrice] = useState("all");
  const [draftDistance, setDraftDistance] = useState("all");

  const [appliedStart, setAppliedStart] = useState("all");
  const [appliedPrice, setAppliedPrice] = useState("all");
  const [appliedDistance, setAppliedDistance] = useState("all");

  const [openMenu, setOpenMenu] = useState(null);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/routes", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setRoutes(response.data);
    } catch (error) {
      console.log("Fetch routes error:", error?.response?.data || error.message);
=======
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch routes"
      );
<<<<<<< HEAD
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const handleDeleteRoute = async (routeId) => {
    const doDelete = async () => {
      try {
        await api.delete(`/routes/${routeId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this route?"
      );
      if (confirmed) {
        await doDelete();
      }
    } else {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this route?", [
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRoutes);
    return unsubscribe;
<<<<<<< HEAD
  }, [navigation, fetchRoutes]);

  const startLocationOptions = useMemo(() => {
    const uniqueLocations = [
      ...new Set(routes.map((route) => route.startLocation).filter(Boolean)),
    ].sort();

    return [
      { label: "All starting locations", value: "all" },
      ...uniqueLocations.map((location) => ({
        label: location,
        value: location,
      })),
    ];
  }, [routes]);

  const applyPriceFilter = (routePrice) => {
    const price = Number(routePrice);

    switch (appliedPrice) {
      case "lt500":
        return price < 500;
      case "500to1000":
        return price >= 500 && price <= 1000;
      case "1001to2000":
        return price >= 1001 && price <= 2000;
      case "gt2000":
        return price > 2000;
      default:
        return true;
    }
  };

  const applyDistanceFilter = (routeDistance) => {
    const distance = Number(routeDistance);

    switch (appliedDistance) {
      case "lt50":
        return distance < 50;
      case "50to100":
        return distance >= 50 && distance <= 100;
      case "101to200":
        return distance >= 101 && distance <= 200;
      case "gt200":
        return distance > 200;
      default:
        return true;
    }
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const matchesStart =
        appliedStart === "all" || route.startLocation === appliedStart;

      const matchesPrice = applyPriceFilter(route.price);
      const matchesDistance = applyDistanceFilter(route.distanceKm);

      return matchesStart && matchesPrice && matchesDistance;
    });
  }, [routes, appliedStart, appliedPrice, appliedDistance]);

  const applyFilters = () => {
    setAppliedStart(draftStart);
    setAppliedPrice(draftPrice);
    setAppliedDistance(draftDistance);
    setOpenMenu(null);
  };

  const clearFilters = () => {
    setDraftStart("all");
    setDraftPrice("all");
    setDraftDistance("all");
    setAppliedStart("all");
    setAppliedPrice("all");
    setAppliedDistance("all");
    setOpenMenu(null);
  };

  const getLabelFromOptions = (options, value) => {
    return options.find((item) => item.value === value)?.label || "Select";
  };

  const renderSelectField = (title, fieldKey, value, options, onSelect) => (
    <View style={styles.selectBlock}>
      <Text style={styles.selectLabel}>{title}</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setOpenMenu(openMenu === fieldKey ? null : fieldKey)}
      >
        <Text style={styles.selectButtonText}>
          {getLabelFromOptions(options, value)}
        </Text>
      </TouchableOpacity>

      {openMenu === fieldKey && (
        <View style={styles.optionList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionItem}
              onPress={() => {
                onSelect(option.value);
                setOpenMenu(null);
              }}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

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

  const renderHeader = () => (
    <>
      <View style={styles.headerCard}>
        <Text style={styles.badge}>QuickBus (Highway Bus Reservation System)</Text>
        <Text style={styles.headerTitle}>
          {user?.role === "admin" ? "Manage Routes" : "Available Routes"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {user?.role === "admin"
            ? "Create, update, and manage highway routes and stops."
            : "Browse highway routes, prices, distance, and stop details."}
        </Text>
      </View>

      <View style={styles.filterCard}>
        <View style={styles.filterHeaderRow}>
          <Text style={styles.filterTitle}>Filter Routes</Text>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderSelectField(
          "Starting Location",
          "start",
          draftStart,
          startLocationOptions,
          setDraftStart
        )}

        {renderSelectField(
          "Price Range",
          "price",
          draftPrice,
          PRICE_OPTIONS,
          setDraftPrice
        )}

        {renderSelectField(
          "Distance Range",
          "distance",
          draftDistance,
          DISTANCE_OPTIONS,
          setDraftDistance
        )}
      </View>
=======
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Routes</Text>
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.addButton}
<<<<<<< HEAD
          onPress={() => navigation.navigate("RouteForm")}
=======
          onPress={() => navigation.navigate("AddRoute")}
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        >
          <Text style={styles.buttonText}>Add Route</Text>
        </TouchableOpacity>
      )}
<<<<<<< HEAD
    </>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loaderText}>Loading routes...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={filteredRoutes}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={<Text style={styles.emptyText}>No routes found</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.routeName}>{item.routeName}</Text>
              <Text style={styles.routePath}>
                {item.startLocation} → {item.endLocation}
              </Text>
            </View>

            <Text
              style={[
                styles.statusBadge,
                item.status === "active"
                  ? styles.activeBadge
                  : styles.inactiveBadge,
              ]}
            >
              {item.status}
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Price</Text>
              <Text style={styles.metricValue}>LKR {item.price}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>{item.distanceKm ?? "-"} km</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Duration</Text>
              <Text style={styles.metricValue}>
                {item.estimatedDuration || "-"}
              </Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Stops</Text>
              <Text style={styles.metricValue}>{item.stopCount || 0}</Text>
            </View>
          </View>

          {!!item.description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>Route Description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
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
            <Text style={styles.buttonText}>
              {user?.role === "admin" ? "Manage Stops" : "View Route Stops"}
            </Text>
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

=======

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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteRoute(item._id)}
              >
                <Text style={styles.buttonText}>Delete Route</Text>
              </TouchableOpacity>
<<<<<<< HEAD
            </>
          )}
        </View>
      )}
    />
=======
            )}
          </View>
        )}
      />
    </View>
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  );
};

export default RouteListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: "#eef4ff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
  },
  headerSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
  filterCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  filterHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 10,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  filterActions: {
    flexDirection: "row",
    gap: 8,
  },
  applyButton: {
    backgroundColor: "#3567e0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "#475569",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
  },
  selectBlock: {
    marginBottom: 12,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
  },
  selectButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "600",
  },
  optionList: {
    marginTop: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  optionText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#3567e0",
    padding: 15,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  routeName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  routePath: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: "hidden",
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  activeBadge: {
    backgroundColor: "#1cab4c",
  },
  inactiveBadge: {
    backgroundColor: "#64748b",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metricBox: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  descriptionBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  descriptionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  description: {
    color: "#475569",
    lineHeight: 21,
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 8,
    fontWeight: "800",
    fontSize: 18,
    color: "#0f172a",
  },
  stopContainer: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  stopText: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 6,
  },
  subText: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 12,
  },
  stopButton: {
    backgroundColor: "#1cab4c",
    padding: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#f4a20b",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: "#ea2424",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
=======
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
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
<<<<<<< HEAD
    fontWeight: "800",
    fontSize: 16,
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
  routeName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});