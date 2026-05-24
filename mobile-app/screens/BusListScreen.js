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
import { AuthContext } from "../context/AuthContext";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
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

  const getStatusStyle = (status) => {
    if (status === "Available") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    if (status === "Maintenance") return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    if (status === "Inactive") return "bg-red-500/20 text-red-300 border border-red-500/30";
    return "bg-slate-500/50 text-slate-300";
  };

  const renderDashboardHeader = () => (
    <View className="mb-4 mt-2 px-3">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/20">
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-3xl font-black text-white shadow-sm flex-1">
          {isAdmin ? "Bus Dashboard" : "Available Buses"}
        </Text>
      </View>

      <GlassCard className="mb-4">
        <Text className="text-indigo-100 text-sm leading-relaxed mb-4">
          {isAdmin
            ? "View total buses, assigned buses, active buses, maintenance buses, and inactive buses."
            : "These are the buses available in the system."}
        </Text>

        <View className="flex-row flex-wrap gap-2 justify-between">
          <View className="w-[31%] bg-white/5 rounded-xl py-3 px-2 items-center border border-white/10">
            <Text className="text-2xl font-black text-white">{totalBuses}</Text>
            <Text className="text-xs text-indigo-200 mt-1 text-center font-semibold">Total Buses</Text>
          </View>

          <View className="w-[31%] bg-white/5 rounded-xl py-3 px-2 items-center border border-white/10">
            <Text className="text-2xl font-black text-white">{assignedCount}</Text>
            <Text className="text-xs text-indigo-200 mt-1 text-center font-semibold">Assigned</Text>
          </View>

          <View className="w-[31%] bg-emerald-500/10 rounded-xl py-3 px-2 items-center border border-emerald-500/20">
            <Text className="text-2xl font-black text-emerald-300">{activeCount}</Text>
            <Text className="text-xs text-emerald-200/70 mt-1 text-center font-semibold">Active</Text>
          </View>

          <View className="w-[31%] bg-amber-500/10 rounded-xl py-3 px-2 items-center border border-amber-500/20">
            <Text className="text-2xl font-black text-amber-300">{maintenanceCount}</Text>
            <Text className="text-xs text-amber-200/70 mt-1 text-center font-semibold">Maintenance</Text>
          </View>

          <View className="w-[31%] bg-red-500/10 rounded-xl py-3 px-2 items-center border border-red-500/20">
            <Text className="text-2xl font-black text-red-300">{inactiveCount}</Text>
            <Text className="text-xs text-red-200/70 mt-1 text-center font-semibold">Inactive</Text>
          </View>
        </View>

        {isAdmin && (
          <GlassButton
            title="+ Add New Bus"
            onPress={() => navigation.navigate("BusForm")}
            className="mt-5 border-cyan-400/50"
            textClassName="text-cyan-300 font-extrabold"
          />
        )}
      </GlassCard>
    </View>
  );

  const renderBus = ({ item }) => (
    <GlassCard className="mx-3 mb-4">
      <View className="flex-row items-start justify-between mb-3 border-b border-white/20 pb-3">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-extrabold text-white">{item.busName}</Text>
          <Text className="text-sm font-semibold text-indigo-200 mt-1">{item.licenseNumber}</Text>
        </View>

        <Text className={`px-3 py-1.5 rounded-lg text-xs font-bold overflow-hidden ${getStatusStyle(item.status)}`}>
          {item.status}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between mb-3">
        <View className="w-[48%] mb-2">
          <Text className="text-xs text-indigo-300 font-semibold mb-1">Type</Text>
          <Text className="text-sm text-white font-bold">{item.busType}</Text>
        </View>
        <View className="w-[48%] mb-2">
          <Text className="text-xs text-indigo-300 font-semibold mb-1">Seats</Text>
          <Text className="text-sm text-white font-bold">{item.seatCount}</Text>
        </View>
        <View className="w-[100%] mb-2">
          <Text className="text-xs text-indigo-300 font-semibold mb-1">Contact</Text>
          <Text className="text-sm text-white font-bold">{item.busContactNumber}</Text>
        </View>
      </View>

      <View className="bg-white/5 rounded-xl p-3 mb-3 border border-white/10">
        <Text className="text-xs font-bold text-white mb-2 uppercase">Crew Details</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-indigo-200 font-medium">Driver:</Text>
          <Text className="text-xs text-white font-bold text-right flex-1 ml-2">{item.driverName} ({item.driverNIC})</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-indigo-200 font-medium">Conductor:</Text>
          <Text className="text-xs text-white font-bold text-right flex-1 ml-2">{item.conductorName} ({item.conductorNIC})</Text>
        </View>
      </View>

      <View className="bg-indigo-500/20 rounded-xl p-3 border border-indigo-400/30">
        <Text className="text-sm text-white font-bold leading-relaxed">
          {item.assignedRoute
            ? `Route: ${item.assignedRoute.routeName}\n${item.assignedRoute.startLocation} → ${item.assignedRoute.endLocation}`
            : "Route: Not Assigned"}
        </Text>
      </View>

      {isAdmin && (
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="bg-amber-500/80 p-3 rounded-xl flex-1 border border-amber-400/50"
            onPress={() => navigation.navigate("BusForm", { busData: item })}
          >
            <Text className="text-white font-bold text-center">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500/80 p-3 rounded-xl flex-1 border border-red-400/50"
            onPress={() => handleDeleteBus(item._id)}
          >
            <Text className="text-white font-bold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </GlassCard>
  );

  if (loading) {
    return (
      <LiquidBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="mt-3 text-white font-semibold">Loading buses...</Text>
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
          <Text className="text-center text-indigo-200 mt-10 font-bold">No buses found.</Text>
        }
      />
    </LiquidBackground>
  );
};

export default BusListScreen;

// We've moved styles to Tailwind classes!