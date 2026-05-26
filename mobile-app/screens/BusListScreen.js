import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import StatusBadge from "../components/StatusBadge";
import { Ionicons } from "@expo/vector-icons";


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
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch buses"
      );
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchBuses);
    return unsubscribe;
  }, [navigation, fetchBuses]);

  const handleDeleteBus = async (id) => {
    Alert.alert("Delete Bus", "Are you sure you want to delete this bus?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/buses/${id}`, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });

            fetchBuses();
          } catch (error) {
            Alert.alert(
              "Error",
              error?.response?.data?.message || "Delete failed"
            );
          }
        },
      },
    ]);
  };

  const totalBuses = buses.length;

  const assignedCount = useMemo(
    () => buses.filter((bus) => bus.assignedRoute).length,
    [buses]
  );

  const activeCount = useMemo(
    () => buses.filter((bus) => bus.status === "Available").length,
    [buses]
  );

  const maintenanceCount = useMemo(
    () => buses.filter((bus) => bus.status === "Maintenance").length,
    [buses]
  );

  const inactiveCount = useMemo(
    () => buses.filter((bus) => bus.status === "Inactive").length,
    [buses]
  );

  // getStatusStyle is replaced by StatusBadge component

  const renderDashboardHeader = () => (
    <View className="mb-4 mt-2 px-3">
      <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-textDark shadow-sm tracking-tight">
          {isAdmin ? "Bus Dashboard" : "Available Buses"}
        </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={20} color="#2F80ED" />
          </TouchableOpacity>
        </View>

      <GlassCard className="mb-4">
        <Text className="text-textMuted text-sm leading-relaxed mb-4">
          {isAdmin
            ? "View total buses, assigned buses, active buses, maintenance buses, and inactive buses."
            : "These are the buses available in the system."}
        </Text>

        <View className="flex-row flex-wrap gap-2 justify-between">
          <View className="w-[31%] bg-[rgba(255,255,255,0.4)] rounded-xl py-3 px-2 items-center border border-[rgba(255,255,255,0.5)]">
            <Text className="text-2xl font-bold text-textDark">{totalBuses}</Text>
            <Text className="text-xs text-textMuted mt-1 text-center font-semibold">Total Buses</Text>
          </View>

          <View className="w-[31%] bg-[rgba(255,255,255,0.4)] rounded-xl py-3 px-2 items-center border border-[rgba(255,255,255,0.5)]">
            <Text className="text-2xl font-bold text-textDark">{assignedCount}</Text>
            <Text className="text-xs text-textMuted mt-1 text-center font-semibold">Assigned</Text>
          </View>

          <View className="w-[31%] bg-emerald-500/20 rounded-xl py-3 px-2 items-center border border-emerald-500/30">
            <Text className="text-2xl font-bold text-emerald-400">{activeCount}</Text>
            <Text className="text-xs text-emerald-400 mt-1 text-center font-semibold">Active</Text>
          </View>

          <View className="w-[31%] bg-amber-500/20 rounded-xl py-3 px-2 items-center border border-amber-500/30">
            <Text className="text-2xl font-bold text-amber-400">{maintenanceCount}</Text>
            <Text className="text-xs text-amber-400 mt-1 text-center font-semibold">Maintenance</Text>
          </View>

          <View className="w-[31%] bg-red-500/20 rounded-xl py-3 px-2 items-center border border-red-500/30">
            <Text className="text-2xl font-bold text-red-400">{inactiveCount}</Text>
            <Text className="text-xs text-red-400 mt-1 text-center font-semibold">Inactive</Text>
          </View>
        </View>

        {isAdmin && (
          <View className="mt-5 px-1">
            <TouchableOpacity 
              className="flex-row items-center justify-center bg-emerald-500/20 py-4 rounded-2xl border border-emerald-500/40 shadow-sm"
              onPress={() => navigation.navigate("BusForm")}
            >
              <Ionicons name="add-circle" size={24} color="#34d399" style={{ marginRight: 8 }} />
              <Text className="text-emerald-300 font-black text-lg tracking-widest uppercase">Add New Bus</Text>
            </TouchableOpacity>
          </View>
        )}
      </GlassCard>
    </View>
  );

  const renderBus = ({ item }) => (
    <GlassCard className="mx-3 mb-4">
      <View className="flex-row items-start justify-between mb-3 border-b border-[rgba(255,255,255,0.5)] pb-3">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-bold text-textDark tracking-tight">{item.busName}</Text>
          <Text className="text-sm font-semibold text-textMuted mt-1">{item.licenseNumber}</Text>
        </View>

        <StatusBadge status={item.status} />
      </View>

      <View className="flex-row flex-wrap justify-between mb-3">
        <View className="w-[48%] mb-2">
          <Text className="text-xs text-textMuted font-semibold mb-1">Type</Text>
          <Text className="text-sm text-textDark font-bold">{item.busType}</Text>
        </View>
        <View className="w-[48%] mb-2">
          <Text className="text-xs text-textMuted font-semibold mb-1">Seats</Text>
          <Text className="text-sm text-textDark font-bold">{item.seatCount}</Text>
        </View>
        <View className="w-[100%] mb-2">
          <Text className="text-xs text-textMuted font-semibold mb-1">Contact</Text>
          <Text className="text-sm text-textDark font-bold">{item.busContactNumber}</Text>
        </View>
      </View>

      <View className="bg-[rgba(255,255,255,0.4)] rounded-xl p-3 mb-3 border border-[rgba(255,255,255,0.5)]">
        <Text className="text-xs font-bold text-textDark mb-2 uppercase">Crew Details</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-textMuted font-medium">Driver:</Text>
          <Text className="text-xs text-textDark font-bold text-right flex-1 ml-2">{item.driverName} ({item.driverNIC})</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-textMuted font-medium">Conductor:</Text>
          <Text className="text-xs text-textDark font-bold text-right flex-1 ml-2">{item.conductorName} ({item.conductorNIC})</Text>
        </View>
      </View>

      <View className="bg-primary/10 rounded-xl p-3 border border-primary/20">
        <Text className="text-sm text-primary font-bold leading-relaxed">
          {item.assignedRoute
            ? `Route: ${item.assignedRoute.routeName}\n${item.assignedRoute.startLocation} → ${item.assignedRoute.endLocation}`
            : "Route: Not Assigned"}
        </Text>
      </View>

      {isAdmin && (
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="bg-amber-500/20 p-3 rounded-xl flex-1 border border-amber-500/30"
            onPress={() => navigation.navigate("BusForm", { busData: item })}
          >
            <Text className="text-amber-400 font-bold text-center">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500/20 p-3 rounded-xl flex-1 border border-red-500/30"
            onPress={() => handleDeleteBus(item._id)}
          >
            <Text className="text-red-400 font-bold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </GlassCard>
  );

  if (loading) {
    return (
      <LiquidBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2F80ED" />
          <Text className="mt-3 text-primary font-semibold">Loading vibrant buses...</Text>
        </View>
      </LiquidBackground>
    );
  }

  return (
    <LiquidBackground>
      <FlatList
        className="flex-1"
        data={buses}
        keyExtractor={(item) => item._id}
        renderItem={renderBus}
        ListHeaderComponent={renderDashboardHeader}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="bus-outline" size={64} color="#2F80ED" />
            <Text className="text-primary mt-4 font-bold text-lg">No buses found</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Your fleet is currently empty.</Text>
          </View>
        }
      />
    </LiquidBackground>
  );
};

export default BusListScreen;

// We've moved styles to Tailwind classes!