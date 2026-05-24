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
    if (status === "Available") return "bg-emerald-100 text-emerald-600 border border-emerald-200";
    if (status === "Maintenance") return "bg-amber-100 text-amber-600 border border-amber-200";
    if (status === "Inactive") return "bg-red-100 text-red-600 border border-red-200";
    return "bg-slate-100 text-slate-600";
  };

  const renderDashboardHeader = () => (
    <View className="mb-4 mt-2 px-3">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">
          {isAdmin ? "Bus Dashboard" : "Available Buses"}
        </Text>
      </View>

      <GlassCard className="mb-4">
        <Text className="text-slate-600 text-sm leading-relaxed mb-4">
          {isAdmin
            ? "View total buses, assigned buses, active buses, maintenance buses, and inactive buses."
            : "These are the buses available in the system."}
        </Text>

        <View className="flex-row flex-wrap gap-2 justify-between">
          <View className="w-[31%] bg-black/5 rounded-xl py-3 px-2 items-center border border-black/5">
            <Text className="text-2xl font-black text-slate-900">{totalBuses}</Text>
            <Text className="text-xs text-slate-500 mt-1 text-center font-semibold">Total Buses</Text>
          </View>

          <View className="w-[31%] bg-black/5 rounded-xl py-3 px-2 items-center border border-black/5">
            <Text className="text-2xl font-black text-slate-900">{assignedCount}</Text>
            <Text className="text-xs text-slate-500 mt-1 text-center font-semibold">Assigned</Text>
          </View>

          <View className="w-[31%] bg-emerald-50 rounded-xl py-3 px-2 items-center border border-emerald-100">
            <Text className="text-2xl font-black text-emerald-600">{activeCount}</Text>
            <Text className="text-xs text-emerald-600 mt-1 text-center font-semibold">Active</Text>
          </View>

          <View className="w-[31%] bg-amber-50 rounded-xl py-3 px-2 items-center border border-amber-100">
            <Text className="text-2xl font-black text-amber-600">{maintenanceCount}</Text>
            <Text className="text-xs text-amber-600 mt-1 text-center font-semibold">Maintenance</Text>
          </View>

          <View className="w-[31%] bg-red-50 rounded-xl py-3 px-2 items-center border border-red-100">
            <Text className="text-2xl font-black text-red-600">{inactiveCount}</Text>
            <Text className="text-xs text-red-600 mt-1 text-center font-semibold">Inactive</Text>
          </View>
        </View>

        {isAdmin && (
          <GlassButton
            title="+ Add New Bus"
            onPress={() => navigation.navigate("BusForm")}
            className="mt-5 border-[#007AFF]/20"
            textClassName="text-white font-extrabold"
          />
        )}
      </GlassCard>
    </View>
  );

  const renderBus = ({ item }) => (
    <GlassCard className="mx-3 mb-4">
      <View className="flex-row items-start justify-between mb-3 border-b border-black/5 pb-3">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-extrabold text-slate-900 tracking-tight">{item.busName}</Text>
          <Text className="text-sm font-semibold text-slate-500 mt-1">{item.licenseNumber}</Text>
        </View>

        <Text className={`px-3 py-1.5 rounded-lg text-xs font-bold overflow-hidden ${getStatusStyle(item.status)}`}>
          {item.status}
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between mb-3">
        <View className="w-[48%] mb-2">
          <Text className="text-xs text-slate-500 font-semibold mb-1">Type</Text>
          <Text className="text-sm text-slate-900 font-bold">{item.busType}</Text>
        </View>
        <View className="w-[48%] mb-2">
          <Text className="text-xs text-slate-500 font-semibold mb-1">Seats</Text>
          <Text className="text-sm text-slate-900 font-bold">{item.seatCount}</Text>
        </View>
        <View className="w-[100%] mb-2">
          <Text className="text-xs text-slate-500 font-semibold mb-1">Contact</Text>
          <Text className="text-sm text-slate-900 font-bold">{item.busContactNumber}</Text>
        </View>
      </View>

      <View className="bg-black/5 rounded-xl p-3 mb-3 border border-black/5">
        <Text className="text-xs font-bold text-slate-900 mb-2 uppercase">Crew Details</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-slate-500 font-medium">Driver:</Text>
          <Text className="text-xs text-slate-900 font-bold text-right flex-1 ml-2">{item.driverName} ({item.driverNIC})</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-slate-500 font-medium">Conductor:</Text>
          <Text className="text-xs text-slate-900 font-bold text-right flex-1 ml-2">{item.conductorName} ({item.conductorNIC})</Text>
        </View>
      </View>

      <View className="bg-blue-50 rounded-xl p-3 border border-blue-100">
        <Text className="text-sm text-blue-800 font-bold leading-relaxed">
          {item.assignedRoute
            ? `Route: ${item.assignedRoute.routeName}\n${item.assignedRoute.startLocation} → ${item.assignedRoute.endLocation}`
            : "Route: Not Assigned"}
        </Text>
      </View>

      {isAdmin && (
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="bg-amber-100 p-3 rounded-xl flex-1 border border-amber-200"
            onPress={() => navigation.navigate("BusForm", { busData: item })}
          >
            <Text className="text-amber-600 font-bold text-center">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-100 p-3 rounded-xl flex-1 border border-red-200"
            onPress={() => handleDeleteBus(item._id)}
          >
            <Text className="text-red-600 font-bold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </GlassCard>
  );

  if (loading) {
    return (
      <LiquidBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0f172a" />
          <Text className="mt-3 text-slate-600 font-semibold">Loading buses...</Text>
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
          <Text className="text-center text-slate-500 mt-10 font-bold">No buses found.</Text>
        }
      />
    </LiquidBackground>
  );
};

export default BusListScreen;

// We've moved styles to Tailwind classes!