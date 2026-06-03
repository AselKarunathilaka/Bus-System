import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppBadge from "../components/ui/AppBadge";
import { Ionicons } from "@expo/vector-icons";

const ScheduleListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const response = await api.get("/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchedules(response.data);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchSchedules();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/schedules/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS !== "web") {
          Alert.alert("Success", "Schedule deleted successfully");
        } else {
          window.alert("Schedule deleted successfully");
        }
        fetchSchedules();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete schedule";
        if (Platform.OS !== "web") {
          Alert.alert("Error", msg);
        } else {
          window.alert(msg);
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to delete this schedule?");
      if (confirmed) {
        executeDelete();
      }
    } else {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this schedule?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: executeDelete,
        },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <AppCard className="mb-4">
      <View className="flex-row justify-between mb-4 border-b border-border pb-4">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-textDark tracking-tight leading-6">
            {item.routeId?.startLocation} to {item.routeId?.endLocation}
          </Text>
        </View>
        <AppBadge status={item.status} />
      </View>
      
      <View className="flex-row flex-wrap justify-between mb-4">
        <View className="w-[48%] mb-3">
          <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Bus</Text>
          <Text className="text-sm text-textDark font-bold">{item.busId?.licenseNumber}</Text>
        </View>
        <View className="w-[48%] mb-3">
          <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Date</Text>
          <Text className="text-sm text-textDark font-bold">
            {new Date(item.departureDate).toLocaleDateString()}
          </Text>
        </View>
        <View className="w-[100%] mb-1">
          <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1">Time</Text>
          <Text className="text-sm text-textDark font-bold">
            {item.departureTime} - {item.arrivalTime}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-end mt-4 gap-3">
        <AppButton
          title="Edit"
          variant="secondary"
          onPress={() => navigation.navigate("ScheduleForm", { schedule: item })}
        />
        <AppButton
          title="Delete"
          variant="danger"
          onPress={() => handleDelete(item._id)}
        />
      </View>
    </AppCard>
  );

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight flex-1">Manage Schedules</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs", { screen: "HomeTab" })} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <View className="mb-6">
          <AppButton
            title="Add New Schedule"
            icon={<Ionicons name="add" size={20} color="white" />}
            onPress={() => navigation.navigate("ScheduleForm")}
            variant="primary"
          />
        </View>
        
        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading schedules...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View className="items-center justify-center mt-20" style={{ opacity: 0.8 }}>
            <Ionicons name="calendar-outline" size={64} color="#94A3B8" />
            <Text className="text-textDark mt-4 font-bold text-lg">No schedules found</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Create a schedule to start assigning buses to routes.</Text>
          </View>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
};

export default ScheduleListScreen;
