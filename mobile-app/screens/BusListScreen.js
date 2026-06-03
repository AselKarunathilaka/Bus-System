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
  ActivityIndicator,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppBadge from "../components/ui/AppBadge";
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

  const renderDashboardHeader = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
            <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-textDark tracking-tight">
            {isAdmin ? "Bus Dashboard" : "Available Buses"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
          <Ionicons name="home-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <AppCard className="mb-6">
        <Text className="text-textMuted text-sm font-medium leading-relaxed mb-6">
          {isAdmin
            ? "Manage and monitor the entire bus fleet from one place."
            : "These are the buses available in the system."}
        </Text>

        <View className="flex-row flex-wrap justify-between gap-y-4">
          <View className="w-[31%] bg-blue-50 rounded-xl py-4 items-center border border-blue-200">
            <Ionicons name="bus" size={24} color="#2563EB" className="mb-2" />
            <Text className="text-2xl font-black text-textDark">{totalBuses}</Text>
            <Text className="text-[10px] text-blue-600 mt-1 text-center font-bold uppercase tracking-widest">Total</Text>
          </View>

          <View className="w-[31%] bg-purple-50 rounded-xl py-4 items-center border border-purple-200">
            <Ionicons name="git-merge" size={24} color="#9333EA" className="mb-2" />
            <Text className="text-2xl font-black text-textDark">{assignedCount}</Text>
            <Text className="text-[10px] text-purple-600 mt-1 text-center font-bold uppercase tracking-widest">Assigned</Text>
          </View>

          <View className="w-[31%] bg-emerald-50 rounded-xl py-4 items-center border border-emerald-200">
            <Ionicons name="checkmark-circle" size={24} color="#10B981" className="mb-2" />
            <Text className="text-2xl font-black text-textDark">{activeCount}</Text>
            <Text className="text-[10px] text-emerald-600 mt-1 text-center font-bold uppercase tracking-widest">Active</Text>
          </View>

          <View className="w-[48%] bg-amber-50 rounded-xl py-4 items-center border border-amber-200">
            <Ionicons name="construct" size={24} color="#D97706" className="mb-2" />
            <Text className="text-2xl font-black text-textDark">{maintenanceCount}</Text>
            <Text className="text-[10px] text-amber-600 mt-1 text-center font-bold uppercase tracking-widest">Maintenance</Text>
          </View>

          <View className="w-[48%] bg-rose-50 rounded-xl py-4 items-center border border-rose-200">
            <Ionicons name="close-circle" size={24} color="#E11D48" className="mb-2" />
            <Text className="text-2xl font-black text-textDark">{inactiveCount}</Text>
            <Text className="text-[10px] text-rose-600 mt-1 text-center font-bold uppercase tracking-widest">Inactive</Text>
          </View>
        </View>

        {isAdmin && (
          <View className="mt-8">
            <AppButton
              title="Add New Bus"
              icon={<Ionicons name="add" size={20} color="white" />}
              onPress={() => navigation.navigate("BusForm")}
              variant="primary"
            />
          </View>
        )}
      </AppCard>
    </View>
  );

  const renderBus = ({ item }) => (
    <AppCard className="mb-4">
      <View className="flex-row items-start justify-between mb-4 border-b border-border pb-4">
        <View className="flex-1 pr-3">
          <Text className="text-xl font-bold text-textDark tracking-tight">{item.busName}</Text>
          <Text className="text-sm font-semibold text-textMuted mt-1">{item.licenseNumber}</Text>
        </View>

        <AppBadge status={item.status} />
      </View>

      <View className="flex-row flex-wrap justify-between mb-4">
        <View className="w-[48%] mb-3">
          <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Type</Text>
          <Text className="text-sm text-textDark font-bold">{item.busType}</Text>
        </View>
        <View className="w-[48%] mb-3">
          <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Seats</Text>
          <Text className="text-sm text-textDark font-bold">{item.seatCount}</Text>
        </View>
        <View className="w-[100%] mb-3">
          <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Contact</Text>
          <Text className="text-sm text-textDark font-bold">{item.busContactNumber}</Text>
        </View>
      </View>

      <View className="bg-slate-50 rounded-xl p-4 mb-4 border border-border">
        <Text className="text-xs font-bold text-textDark mb-3 uppercase">Crew Details</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-xs text-textMuted font-medium">Driver:</Text>
          <Text className="text-xs text-textDark font-bold text-right flex-1 ml-2">{item.driverName} ({item.driverNIC})</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-xs text-textMuted font-medium">Conductor:</Text>
          <Text className="text-xs text-textDark font-bold text-right flex-1 ml-2">{item.conductorName} ({item.conductorNIC})</Text>
        </View>
      </View>

      <View className="rounded-xl p-4" style={{ backgroundColor: "rgba(37,99,235,0.05)", borderWidth: 1, borderColor: "rgba(37,99,235,0.2)" }}>
        <Text className="text-sm text-primary font-bold leading-relaxed">
          {item.assignedRoute
            ? `Route: ${item.assignedRoute.routeName}\n${item.assignedRoute.startLocation} → ${item.assignedRoute.endLocation}`
            : "Route: Not Assigned"}
        </Text>
      </View>

      {isAdmin && (
        <View className="flex-row gap-3 mt-5">
          <AppButton
            title="Edit"
            variant="secondary"
            className="flex-1"
            onPress={() => navigation.navigate("BusForm", { busData: item })}
          />
          <AppButton
            title="Delete"
            variant="danger"
            className="flex-1"
            onPress={() => handleDeleteBus(item._id)}
          />
        </View>
      )}
    </AppCard>
  );

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading buses...</Text>
          </View>
        ) : (
          <FlatList
            className="flex-1"
            data={buses}
            keyExtractor={(item) => item._id}
            renderItem={renderBus}
            ListHeaderComponent={renderDashboardHeader}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center mt-20" style={{ opacity: 0.8 }}>
                <Ionicons name="bus-outline" size={64} color="#94A3B8" />
                <Text className="text-textDark mt-4 font-bold text-lg">No buses found</Text>
                <Text className="text-textMuted text-sm mt-1 text-center">Your fleet is currently empty.</Text>
              </View>
            }
          />
        )}
      </View>
    </AppLayout>
  );
};

export default BusListScreen;