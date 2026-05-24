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
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const StopListScreen = ({ route, navigation }) => {
  const { token, user, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const { routeId, routeName } = route.params;
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStops = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get(`/stops/route/${routeId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

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
  }, [routeId, authToken]);

  const handleDeleteStop = async (stopId) => {
    const doDelete = async () => {
      try {
        console.log("Deleting stop:", stopId);

        await api.delete(`/stops/${stopId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        Alert.alert("Success", "Stop deleted successfully");
        fetchStops();
      } catch (error) {
        console.log("Delete stop error:", error?.response?.data || error.message);
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text className="mt-3 text-slate-400 font-semibold">Loading stops...</Text>
        </View>
      </LiquidBackground>
    );
  }

  const renderHeader = () => (
    <>
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white shadow-sm flex-1 tracking-tight">
          {routeName} Stops
        </Text>
      </View>

      <GlassCard className="mb-4">
        <Text className="text-slate-400 text-sm leading-relaxed mb-4">
          {user?.role === "admin"
            ? "Add, edit, and remove stops for this route"
            : "View all stops available in this route"}
        </Text>

        {user?.role === "admin" && (
          <GlassButton
            title="+ Add Stop"
            onPress={() => navigation.navigate("StopForm", { routeId })}
            className="border-white/10"
            textClassName="text-white font-bold"
          />
        )}
      </GlassCard>
    </>
  );

  return (
    <LiquidBackground>
      <FlatList
        data={stops}
        className="flex-1"
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center mt-10 text-slate-400 font-medium">No stops found for this route</Text>
        }
        renderItem={({ item }) => (
          <GlassCard className="mb-4">
            <Text className="text-lg font-bold text-white mb-1 tracking-tight">
              {item.order}. {item.stopName}
            </Text>
            <Text className="text-sm font-medium text-slate-400 mb-4">Location: {item.location}</Text>

            {user?.role === "admin" && (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="bg-amber-500/20 p-3 rounded-xl flex-1 border border-amber-500/30"
                  onPress={() =>
                    navigation.navigate("StopForm", {
                      routeId,
                      stopData: item,
                    })
                  }
                >
                  <Text className="text-amber-400 font-bold text-center">Edit Stop</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-red-500/20 p-3 rounded-xl flex-1 border border-red-500/30"
                  onPress={() => handleDeleteStop(item._id)}
                >
                  <Text className="text-red-400 font-bold text-center">Delete Stop</Text>
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