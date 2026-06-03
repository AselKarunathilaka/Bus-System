import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppBadge from "../components/ui/AppBadge";
import { Ionicons } from "@expo/vector-icons";

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
  const { token, user } = useContext(AuthContext);

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

      const response = await api.get("/routes");

      setRoutes(response.data);
    } catch (error) {
      console.log("Fetch routes error:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch routes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteRoute = async (routeId) => {
    const doDelete = async () => {
      try {
        await api.delete(`/routes/${routeId}`);

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
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRoutes);
    return unsubscribe;
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
    <View className="mb-4">
      <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-2 ml-1">{title}</Text>
      <TouchableOpacity
        className="bg-background border border-border p-4 rounded-xl flex-row justify-between items-center"
        onPress={() => setOpenMenu(openMenu === fieldKey ? null : fieldKey)}
        activeOpacity={0.7}
      >
        <Text className="text-textDark font-bold text-base">
          {getLabelFromOptions(options, value)}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#94A3B8" />
      </TouchableOpacity>

      {openMenu === fieldKey && (
        <View className="mt-2 bg-white rounded-xl border border-border overflow-hidden shadow-sm">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="p-4 border-b border-slate-100"
              onPress={() => {
                onSelect(option.value);
                setOpenMenu(null);
              }}
              activeOpacity={0.7}
            >
              <Text className="text-textDark font-medium text-base">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderStopsPreview = (stops = []) => {
    if (!stops.length) {
      return <Text className="text-textMuted text-sm mb-4">No stops added yet</Text>;
    }

    return (
      <View className="bg-slate-50 p-4 rounded-xl mb-4 border border-border">
        {stops.map((stop) => (
          <Text key={stop._id} className="text-textDark text-sm mb-1.5 font-medium">
            • {stop.order}. {stop.stopName} - {stop.location}
          </Text>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
            <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-textDark tracking-tight">
            {user?.role === "admin" ? "Manage Routes" : "Available Routes"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
          <Ionicons name="home-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <AppCard className="mb-6">
        <View className="self-start px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: "rgba(37,99,235,0.1)", borderWidth: 1, borderColor: "rgba(37,99,235,0.2)" }}>
          <Text className="text-xs font-bold text-primary uppercase tracking-widest">
            QuickBus Routing
          </Text>
        </View>
        <Text className="text-textMuted text-sm leading-relaxed mb-1">
          {user?.role === "admin"
            ? "Create, update, and manage highway routes and stops."
            : "Browse highway routes, prices, distance, and stop details."}
        </Text>
      </AppCard>

      <AppCard className="mb-6">
        <View className="flex-row justify-between items-center mb-6 border-b border-border pb-4">
          <View className="flex-row items-center">
            <Ionicons name="filter" size={20} color="#2563EB" className="mr-2" />
            <Text className="text-lg font-bold text-textDark tracking-tight">Filter Routes</Text>
          </View>

          <View className="flex-row gap-3">
            <AppButton
              title="Apply"
              onPress={applyFilters}
              className="py-2 px-4 rounded-lg"
              textClassName="text-xs uppercase"
            />
            <AppButton
              title="Clear"
              variant="secondary"
              onPress={clearFilters}
              className="py-2 px-4 rounded-lg"
              textClassName="text-xs uppercase"
            />
          </View>
        </View>

        {renderSelectField("Starting Location", "start", draftStart, startLocationOptions, setDraftStart)}
        {renderSelectField("Price Range", "price", draftPrice, PRICE_OPTIONS, setDraftPrice)}
        {renderSelectField("Distance Range", "distance", draftDistance, DISTANCE_OPTIONS, setDraftDistance)}
      </AppCard>

      {user?.role === "admin" && (
        <View className="mb-2">
          <AppButton
            title="Add New Route"
            icon={<Ionicons name="add" size={20} color="white" />}
            onPress={() => navigation.navigate("RouteForm")}
            variant="primary"
          />
        </View>
      )}
    </View>
  );

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="text-textMuted mt-4 font-medium">Loading routes...</Text>
          </View>
        ) : (
          <FlatList
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            data={filteredRoutes}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View className="items-center justify-center mt-20" style={{ opacity: 0.8 }}>
                <Ionicons name="map-outline" size={64} color="#94A3B8" />
                <Text className="text-textDark mt-4 font-bold text-lg">No routes found</Text>
                <Text className="text-textMuted text-sm mt-1 text-center max-w-[250px]">Try adjusting your filters or checking back later.</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <AppCard className="mb-6">
                <View className="flex-row items-start justify-between mb-5 border-b border-border pb-5">
                  <View className="flex-1 pr-4">
                    <Text className="text-xl font-bold text-textDark mb-2 tracking-tight">{item.routeName}</Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location" size={16} color="#2563EB" />
                      <Text className="text-sm font-semibold text-textDark mx-2">{item.startLocation}</Text>
                      <Ionicons name="arrow-forward" size={14} color="#94A3B8" />
                      <Text className="text-sm font-semibold text-textDark ml-2">{item.endLocation}</Text>
                    </View>
                  </View>
                  <AppBadge status={item.status} />
                </View>

                <View className="flex-row flex-wrap justify-between mb-4">
                  <View className="w-[48%] bg-slate-50 rounded-xl p-4 mb-3 border border-border">
                    <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Price</Text>
                    <Text className="text-base font-bold text-textDark">LKR {item.price}</Text>
                  </View>

                  <View className="w-[48%] bg-slate-50 rounded-xl p-4 mb-3 border border-border">
                    <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Distance</Text>
                    <Text className="text-base font-bold text-textDark">{item.distanceKm ?? "-"} km</Text>
                  </View>

                  <View className="w-[48%] bg-slate-50 rounded-xl p-4 mb-3 border border-border">
                    <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Duration</Text>
                    <Text className="text-base font-bold text-textDark">
                      {item.estimatedDuration || "-"}
                    </Text>
                  </View>

                  <View className="w-[48%] bg-slate-50 rounded-xl p-4 mb-3 border border-border">
                    <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Stops</Text>
                    <Text className="text-base font-bold text-textDark">{item.stopCount || 0}</Text>
                  </View>
                </View>

                {!!item.description && (
                  <View className="bg-slate-50 border border-border rounded-xl p-4 mb-5">
                    <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2">Description</Text>
                    <Text className="text-sm text-textDark leading-relaxed">{item.description}</Text>
                  </View>
                )}

                <Text className="text-lg font-bold text-textDark mb-3 tracking-tight">Stops</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("StopList", {
                      routeId: item._id,
                      routeName: item.routeName,
                    })
                  }
                >
                  {renderStopsPreview(item.stops)}
                </TouchableOpacity>

                <TouchableOpacity 
                  className="py-2 px-4 rounded-lg mt-2 self-center"
                  style={{ backgroundColor: "rgba(37,99,235,0.1)", borderWidth: 1, borderColor: "rgba(37,99,235,0.2)" }}
                  onPress={() => navigation.navigate("StopList", { routeId: item._id, routeName: item.routeName })}
                >
                  <Text className="text-primary text-[10px] font-bold uppercase tracking-widest text-center">
                    {user?.role === "admin" ? "Manage Stops" : "View Route Stops"}
                  </Text>
                </TouchableOpacity>

                {user?.role === "admin" && (
                  <View className="flex-row justify-between mt-6 gap-3">
                    <AppButton
                      title="Edit Route"
                      variant="secondary"
                      className="flex-1"
                      onPress={() =>
                        navigation.navigate("RouteForm", {
                          routeData: item,
                        })
                      }
                    />
                    <AppButton
                      title="Delete"
                      variant="danger"
                      className="flex-1"
                      onPress={() => handleDeleteRoute(item._id)}
                    />
                  </View>
                )}
              </AppCard>
            )}
          />
        )}
      </View>
    </AppLayout>
  );
};

export default RouteListScreen;