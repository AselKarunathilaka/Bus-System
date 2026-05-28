import React, { useContext, useEffect, useState, useCallback } from "react";
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
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import { Ionicons } from "@expo/vector-icons";

const StopListScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);

  const { routeId, routeName } = route.params;
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStops = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stops/route/${routeId}`);
      setStops(response.data);
    } catch (error) {
      console.log("Fetch stops error:", error?.response?.data || error.message);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch stops"
      );
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  const handleDeleteStop = async (stopId) => {
    const doDelete = async () => {
      try {
        await api.delete(`/stops/${stopId}`);
        Alert.alert("Success", "Stop deleted successfully");
        fetchStops();
      } catch (error) {
        Alert.alert(
          "Error",
          error?.response?.data?.message || "Failed to delete stop"
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this stop?"
      );
      if (confirmed) {
        await doDelete();
      }
    } else {
      Alert.alert("Confirm Delete", "Are you sure you want to delete this stop?", [
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
    const unsubscribe = navigation.addListener("focus", fetchStops);
    return unsubscribe;
  }, [navigation, fetchStops]);

  if (loading) {
    return (
      <LiquidBackground>
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#2F80ED" />
          <Text className="mt-3 text-primary font-semibold">Loading stops...</Text>
        </View>
      </LiquidBackground>
    );
  }

  const renderHeader = () => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="arrow-back" size={24} color="#2F80ED" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-textDark shadow-sm tracking-tight flex-1">
            {routeName} Stops
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
          <Ionicons name="home" size={20} color="#2F80ED" />
        </TouchableOpacity>
      </View>

      <GlassCard className="mb-4">
        <Text className="text-textMuted text-sm leading-relaxed mb-4">
          {user?.role === "admin"
            ? "Add, edit, and remove stops for this route"
            : "View all stops available in this route"}
        </Text>

        {user?.role === "admin" && (
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-[rgba(255,255,255,0.6)] py-4 rounded-2xl border border-[rgba(255,255,255,0.8)] shadow-sm"
            onPress={() => navigation.navigate("StopForm", { routeId })}
          >
            <Ionicons name="add-circle" size={24} color="#059669" style={{ marginRight: 8 }} />
            <Text className="text-[#059669] font-black text-lg tracking-widest uppercase">Add Stop</Text>
          </TouchableOpacity>
        )}
      </GlassCard>
    </View>
  );

  return (
    <LiquidBackground>
      <FlatList
        data={stops}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-10 opacity-80">
            <Ionicons name="location-outline" size={64} color="#2F80ED" />
            <Text className="text-primary mt-4 font-bold text-lg">No Stops Found</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">
              There are no stops created for this route yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <GlassCard className="mb-4">
            <View className="flex-row items-center justify-between mb-3 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <View className="flex-row items-center flex-1">
                <View className="bg-[rgba(255,255,255,0.6)] p-2 rounded-full mr-3 border border-[rgba(255,255,255,0.8)]">
                  <Ionicons name="location" size={20} color="#2F80ED" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-textDark tracking-tight">{item.stopName}</Text>
                  <Text className="text-xs text-textMuted font-bold uppercase tracking-widest mt-1">Order: {item.order}</Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-textMuted text-sm leading-relaxed">{item.location}</Text>
            </View>

            {user?.role === "admin" && (
              <View className="flex-row justify-between pt-2 border-t border-[rgba(255,255,255,0.3)]">
                <TouchableOpacity
                  className="bg-[rgba(255,255,255,0.4)] p-3 rounded-xl flex-1 mr-2 border border-[rgba(255,255,255,0.5)]"
                  onPress={() =>
                    navigation.navigate("StopForm", {
                      routeId,
                      stopData: item,
                    })
                  }
                >
                  <Text className="text-[#d97706] font-bold text-center">Edit Stop</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[rgba(220,38,38,0.1)] p-3 rounded-xl flex-1 ml-2 border border-[rgba(220,38,38,0.3)]"
                  onPress={() => handleDeleteStop(item._id)}
                >
                  <Text className="text-red-500 font-bold text-center">Delete Stop</Text>
                </TouchableOpacity>
              </View>
            )}
          </GlassCard>
        )}
      />
    </LiquidBackground>
  );
};

export default StopListScreen;