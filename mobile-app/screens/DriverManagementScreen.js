import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppBadge from "../components/ui/AppBadge";
import AppButton from "../components/ui/AppButton";
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
            rating: "N/A"
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
    <AppCard className="mb-4">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "rgba(37,99,235,0.1)" }}>
            <Ionicons name={item.role === "Driver" ? "car-sport" : "ticket"} size={20} color="#2563EB" />
          </View>
          <View>
            <Text className="text-textDark font-bold text-lg tracking-tight">{item.name}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-teal-600 text-xs font-bold mr-2 uppercase tracking-widest">{item.role}</Text>
              <Ionicons name="bus" size={12} color="#64748B" />
              <Text className="text-textMuted text-xs font-bold ml-1">{item.busName}</Text>
            </View>
          </View>
        </View>
        <AppBadge status={item.status} />
      </View>

      <View className="flex-row justify-between border-t border-border pt-4">
        <View>
          <Text className="text-textMuted text-[10px] uppercase font-bold tracking-widest mb-1">{item.role === "Driver" ? "License/NIC" : "ID No"}</Text>
          <Text className="text-textDark font-bold text-sm">{item.license}</Text>
        </View>
        <View>
          <Text className="text-textMuted text-[10px] uppercase font-bold tracking-widest mb-1">Contact</Text>
          <Text className="text-textDark font-bold text-sm">{item.phone}</Text>
        </View>
        <View className="flex-row gap-2 justify-center">
          <TouchableOpacity onPress={() => handleEdit(item)} className="bg-amber-50 p-2 rounded-lg border border-amber-200 ml-2">
            <Ionicons name="pencil" size={16} color="#D97706" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="bg-danger-bg p-2 rounded-lg ml-2" style={{ borderWidth: 1, borderColor: "rgba(239,68,68,0.2)" }}>
            <Ionicons name="trash" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </AppCard>
  );

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 p-6 max-w-4xl w-full self-center">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight flex-1">Crew Management</Text>
          </View>
          <AppButton
            title="New"
            icon={<Ionicons name="add" size={18} color="white" />}
            onPress={() => navigation.navigate("BusForm")}
            className="py-2 px-4"
          />
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading crew data...</Text>
          </View>
        ) : crew.length === 0 ? (
          <View className="items-center justify-center mt-20" style={{ opacity: 0.8 }}>
            <Ionicons name="people-outline" size={64} color="#94A3B8" />
            <Text className="text-textDark mt-4 font-bold text-lg">No Crew Found</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Add a bus to register new crew members.</Text>
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
    </AppLayout>
  );
};

export default DriverManagementScreen;
