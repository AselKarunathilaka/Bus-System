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
  const { token, user } = useContext(AuthContext);

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/buses");

      setBuses(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch buses"
      );
    } finally {
      setLoading(false);
    }
  }, []);

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
            await api.delete(`/buses/${id}`);

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
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.2)] p-2 rounded-full border border-[rgba(255,255,255,0.3)]">
            <Ionicons name="arrow-back" size={24} color="#3b82f6" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-white tracking-tight">
            {isAdmin ? "Bus Dashboard" : "Available Buses"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.2)] p-2 rounded-full border border-[rgba(255,255,255,0.3)]">
          <Ionicons name="home" size={20} color="#60a5fa" />
        </TouchableOpacity>
      </View>

      <GlassCard className="mb-4">
        <Text className="text-slate-200 text-sm font-medium leading-relaxed mb-4">
          {isAdmin
            ? "Manage and monitor the entire bus fleet from one place."
            : "These are the buses available in the system."}
        </Text>

        <View className="flex-row flex-wrap justify-between gap-y-3">
          <View className="w-[31%] bg-blue-50 rounded-xl py-4 items-center border-[2px] border-blue-500 shadow-sm">
            <Ionicons name="bus" size={20} color="#2563EB" className="mb-1" />
            <Text className="text-2xl font-black text-[#0F172A]">{totalBuses}</Text>
            <Text className="text-[11px] text-blue-700 mt-1 text-center font-extrabold uppercase tracking-widest">Total</Text>
          </View>

          <View className="w-[31%] bg-purple-50 rounded-xl py-4 items-center border-[2px] border-purple-500 shadow-sm">
            <Ionicons name="git-merge" size={20} color="#9333EA" className="mb-1" />
            <Text className="text-2xl font-black text-[#0F172A]">{assignedCount}</Text>
            <Text className="text-[11px] text-purple-700 mt-1 text-center font-extrabold uppercase tracking-widest">Assigned</Text>
          </View>

          <View className="w-[31%] bg-green-50 rounded-xl py-4 items-center border-[2px] border-green-500 shadow-sm">
            <Ionicons name="checkmark-circle" size={20} color="#16A34A" className="mb-1" />
            <Text className="text-2xl font-black text-[#0F172A]">{activeCount}</Text>
            <Text className="text-[11px] text-green-700 mt-1 text-center font-extrabold uppercase tracking-widest">Active</Text>
          </View>

          <View className="w-[48%] bg-amber-50 rounded-xl py-4 items-center border-[2px] border-amber-500 shadow-sm">
            <Ionicons name="construct" size={20} color="#D97706" className="mb-1" />
            <Text className="text-2xl font-black text-[#0F172A]">{maintenanceCount}</Text>
            <Text className="text-[11px] text-amber-700 mt-1 text-center font-extrabold uppercase tracking-widest">Maintenance</Text>
          </View>

          <View className="w-[48%] bg-red-50 rounded-xl py-4 items-center border-[2px] border-red-500 shadow-sm">
            <Ionicons name="close-circle" size={20} color="#DC2626" className="mb-1" />
            <Text className="text-2xl font-black text-[#0F172A]">{inactiveCount}</Text>
            <Text className="text-[11px] text-red-700 mt-1 text-center font-extrabold uppercase tracking-widest">Inactive</Text>
          </View>
        </View>

        {isAdmin && (
          <View className="mt-6">
            <GlassButton
              title="Add New Bus"
              icon={<Ionicons name="add-circle" size={22} color="white" />}
              onPress={() => navigation.navigate("BusForm")}
              variant="primary"
            />
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