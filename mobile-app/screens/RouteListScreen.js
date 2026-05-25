import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
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
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import StatusBadge from "../components/StatusBadge";
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
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch routes"
      );
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
    <View className="mb-3">
      <Text className="text-xs font-bold text-slate-400 uppercase mb-1">{title}</Text>
      <TouchableOpacity
        className="bg-white/10 border border-white/10 p-3 rounded-xl flex-row justify-between items-center"
        onPress={() => setOpenMenu(openMenu === fieldKey ? null : fieldKey)}
      >
        <Text className="text-white font-semibold">
          {getLabelFromOptions(options, value)}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#ffffff" />
      </TouchableOpacity>

      {openMenu === fieldKey && (
        <View className="mt-2 bg-slate-800 rounded-xl border border-white/10 overflow-hidden shadow-sm">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="p-3 border-b border-white/5"
              onPress={() => {
                onSelect(option.value);
                setOpenMenu(null);
              }}
            >
              <Text className="text-white font-medium">{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderStopsPreview = (stops = []) => {
    if (!stops.length) {
      return <Text className="text-slate-400 text-sm mb-3">No stops added yet</Text>;
    }

    return (
      <View className="bg-white/5 p-3 rounded-xl mb-3 border border-white/10">
        {stops.map((stop) => (
          <Text key={stop._id} className="text-slate-300 text-sm mb-1">
            • {stop.order}. {stop.stopName} - {stop.location}
          </Text>
        ))}
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white shadow-sm tracking-tight">
          {user?.role === "admin" ? "Manage Routes" : "Available Routes"}
        </Text>
      </View>

      <GlassCard className="mb-4">
        <Text className="text-xs font-bold text-white bg-white/10 self-start px-3 py-1 rounded-full mb-3 border border-white/10">
          QuickBus Routing
        </Text>
        <Text className="text-slate-400 text-sm leading-relaxed">
          {user?.role === "admin"
            ? "Create, update, and manage highway routes and stops."
            : "Browse highway routes, prices, distance, and stop details."}
        </Text>
      </GlassCard>

      <GlassCard className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-white tracking-tight">Filter Routes</Text>

          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-[#007AFF] px-3 py-1.5 rounded-lg border border-[#007AFF]" onPress={applyFilters}>
              <Text className="text-white font-bold text-xs">Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10" onPress={clearFilters}>
              <Text className="text-slate-400 font-bold text-xs">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderSelectField("Starting Location", "start", draftStart, startLocationOptions, setDraftStart)}
        {renderSelectField("Price Range", "price", draftPrice, PRICE_OPTIONS, setDraftPrice)}
        {renderSelectField("Distance Range", "distance", draftDistance, DISTANCE_OPTIONS, setDraftDistance)}
      </GlassCard>

      {user?.role === "admin" && (
        <GlassButton
          title="Add New Route"
          onPress={() => navigation.navigate("RouteForm")}
          className="mb-4"
          textClassName="text-white font-extrabold"
        />
      )}
    </>
  );

  if (loading) {
    return (
      <LiquidBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#a855f7" />
          <Text className="text-purple-300 mt-3 font-semibold">Loading vibrant routes...</Text>
        </View>
      </LiquidBackground>
    );
  }

  return (
    <LiquidBackground>
      <FlatList
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        data={filteredRoutes}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="map-outline" size={64} color="#a855f7" />
            <Text className="text-purple-200 mt-4 font-bold text-lg">No routes found</Text>
            <Text className="text-slate-400 text-sm mt-1 text-center max-w-[250px]">Try adjusting your filters or checking back later.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <GlassCard className="mb-4">
            <View className="flex-row items-start justify-between mb-4 border-b border-white/10 pb-4">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-white mb-1 tracking-tight">{item.routeName}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="location" size={14} color="#0ea5e9" />
                  <Text className="text-sm font-semibold text-[#0ea5e9] mx-1">{item.startLocation}</Text>
                  <Ionicons name="arrow-forward" size={12} color="#94a3b8" />
                  <Text className="text-sm font-semibold text-[#a855f7] ml-1">{item.endLocation}</Text>
                </View>
              </View>

              <StatusBadge status={item.status} />
            </View>

            <View className="flex-row flex-wrap justify-between mb-3">
              <View className="w-[48%] bg-white/10 rounded-xl p-3 mb-2 border border-white/10">
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">Price</Text>
                <Text className="text-base font-bold text-white">LKR {item.price}</Text>
              </View>

              <View className="w-[48%] bg-white/10 rounded-xl p-3 mb-2 border border-white/10">
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">Distance</Text>
                <Text className="text-base font-bold text-white">{item.distanceKm ?? "-"} km</Text>
              </View>

              <View className="w-[48%] bg-white/10 rounded-xl p-3 mb-2 border border-white/10">
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">Duration</Text>
                <Text className="text-base font-bold text-white">
                  {item.estimatedDuration || "-"}
                </Text>
              </View>

              <View className="w-[48%] bg-white/10 rounded-xl p-3 mb-2 border border-white/10">
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">Stops</Text>
                <Text className="text-base font-bold text-white">{item.stopCount || 0}</Text>
              </View>
            </View>

            {!!item.description && (
              <View className="bg-white/10 border border-white/10 rounded-xl p-3 mb-3">
                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">Description</Text>
                <Text className="text-sm text-slate-300">{item.description}</Text>
              </View>
            )}

            <Text className="text-lg font-bold text-white mb-2 tracking-tight">Stops</Text>
            {renderStopsPreview(item.stops)}

            <TouchableOpacity
              className="bg-white/10 p-3 rounded-xl mt-1 border border-white/10"
              onPress={() =>
                navigation.navigate("StopList", {
                  routeId: item._id,
                  routeName: item.routeName,
                })
              }
            >
              <Text className="text-white text-center font-bold">
                {user?.role === "admin" ? "Manage Stops" : "View Route Stops"}
              </Text>
            </TouchableOpacity>

            {user?.role === "admin" && (
              <View className="flex-row justify-between mt-3">
                <TouchableOpacity
                  className="bg-amber-500/20 p-3 rounded-xl flex-1 mr-2 border border-amber-500/30"
                  onPress={() =>
                    navigation.navigate("RouteForm", {
                      routeData: item,
                    })
                  }
                >
                  <Text className="text-amber-400 text-center font-bold">Edit Route</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500/20 p-3 rounded-xl flex-1 ml-2 border border-red-500/30"
                  onPress={() => handleDeleteRoute(item._id)}
                >
                  <Text className="text-red-400 text-center font-bold">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        )}
      />
    </LiquidBackground>
  );
};

export default RouteListScreen;

// We've moved styles to Tailwind classes!