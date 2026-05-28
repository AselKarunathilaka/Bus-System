import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const DriverManagementScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrew = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const buses = response.data;
      const crewList = [];

      buses.forEach(bus => {
        if (bus.driverName) {
          crewList.push({
            id: `${bus._id}_driver`,
            busId: bus._id,
            busData: bus,
            name: bus.driverName,
            role: "Driver",
            license: bus.driverNIC || "N/A",
            phone: bus.busContactNumber || "N/A",
            status: bus.status || "Unknown",
            busName: bus.busName,
            rating: "N/A" // Real rating not in schema yet
          });
        }
        
        if (bus.conductorName) {
          crewList.push({
            id: `${bus._id}_conductor`,
            busId: bus._id,
            busData: bus,
            name: bus.conductorName,
            role: "Conductor",
            license: bus.conductorNIC || "N/A",
            phone: bus.busContactNumber || "N/A",
            status: bus.status || "Unknown",
            busName: bus.busName,
            rating: "N/A"
          });
        }
      });

      setCrew(crewList);
    } catch (error) {
      console.log("Fetch crew error:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to load crew data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchCrew);
    return unsubscribe;
  }, [navigation, fetchCrew]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "available": return "#10b981"; // Emerald
      case "active": return "#10b981";
      case "on trip": return "#3b82f6"; // Blue
      case "maintenance": return "#f59e0b"; // Amber
      case "inactive": return "#64748b"; // Slate
      case "suspended": return "#ef4444"; // Red
      default: return "#94a3b8";
    }
  };

  const handleEdit = (item) => {
    navigation.navigate("BusForm", { busData: item.busData });
  };

  const handleDelete = () => {
    const msg = "Crew members are attached to Buses. Please Edit the associated Bus to remove a crew member.";
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert("Cannot Delete Directly", msg);
    }
  };

  const renderItem = ({ item }) => (
    <GlassCard className="mb-4">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-[rgba(255,255,255,0.1)] w-12 h-12 rounded-full items-center justify-center mr-3 border border-white/20">
            <Ionicons name={item.role === "Driver" ? "car-sport" : "ticket"} size={20} color="#fff" />
          </View>
          <View>
            <Text className="text-white font-bold text-lg tracking-tight">{item.name}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-teal-400 text-xs font-bold mr-2 uppercase tracking-widest">{item.role}</Text>
              <Ionicons name="bus" size={12} color="#94a3b8" />
              <Text className="text-slate-300 text-xs font-bold ml-1">{item.busName}</Text>
            </View>
          </View>
        </View>
        <View 
          style={{ backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) + '40' }} 
          className="px-3 py-1 rounded-full border"
        >
          <Text style={{ color: getStatusColor(item.status) }} className="text-[10px] font-bold uppercase tracking-widest">{item.status}</Text>
        </View>
      </View>

      <View className="flex-row justify-between border-t border-white/10 pt-3 mt-1">
        <View>
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">{item.role === "Driver" ? "License/NIC" : "ID No"}</Text>
          <Text className="text-slate-200 font-bold">{item.license}</Text>
        </View>
        <View>
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Contact</Text>
          <Text className="text-slate-200 font-bold">{item.phone}</Text>
        </View>
        <View className="flex-row gap-2 justify-center">
          <TouchableOpacity onPress={() => handleEdit(item)} className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/30">
            <Ionicons name="pencil" size={16} color="#fbbf24" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="bg-red-500/20 p-2 rounded-lg border border-red-500/30">
            <Ionicons name="trash" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white tracking-tight flex-1">Crew Management</Text>
          </View>
          <TouchableOpacity 
            className="bg-primary/20 p-2 px-4 rounded-full border border-primary/30 flex-row items-center"
            onPress={() => navigation.navigate("BusForm")}
          >
            <Ionicons name="add" size={18} color="#60a5fa" />
            <Text className="text-blue-300 font-bold text-xs ml-1">New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2F80ED" />
            <Text className="mt-3 text-white font-semibold">Loading crew data...</Text>
          </View>
        ) : crew.length === 0 ? (
          <View className="items-center justify-center mt-16 opacity-80">
            <Ionicons name="people-outline" size={64} color="#2F80ED" />
            <Text className="text-white mt-4 font-bold text-lg">No Crew Found</Text>
            <Text className="text-slate-300 text-sm mt-1 text-center">Add a bus to register new crew members.</Text>
          </View>
        ) : (
          <FlatList
            data={crew}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </LiquidBackground>
  );
};

export default DriverManagementScreen;
