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
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import { Ionicons } from "@expo/vector-icons";

const StopListScreen = ({ route, navigation }) => {
  const { token, user } = useContext(AuthContext);

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
      <AppLayout useSafeArea>
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-4 text-textMuted font-medium">Loading stops...</Text>
        </View>
      </AppLayout>
    );
  }

  const renderHeader = () => (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
            <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-textDark tracking-tight flex-1">
            {routeName} Stops
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
          <Ionicons name="home-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <AppCard className="mb-6">
        <Text className="text-textMuted text-sm leading-relaxed mb-6">
          {user?.role === "admin"
            ? "Add, edit, and remove stops for this route."
            : "View all stops available in this route."}
        </Text>

        {user?.role === "admin" && (
          <AppButton
            title="Add Stop"
            icon={<Ionicons name="add" size={20} color="white" />}
            onPress={() => navigation.navigate("StopForm", { routeId })}
            variant="primary"
          />
        )}
      </AppCard>
    </View>
  );

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <FlatList
          data={stops}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center mt-16" style={{ opacity: 0.8 }}>
              <Ionicons name="location-outline" size={64} color="#94A3B8" />
              <Text className="text-textDark mt-4 font-bold text-lg">No Stops Found</Text>
              <Text className="text-textMuted text-sm mt-1 text-center">
                There are no stops created for this route yet.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <AppCard className="mb-4">
              <View className="flex-row items-center justify-between mb-4 border-b border-border pb-4">
                <View className="flex-row items-center flex-1">
                  <View className="p-3 rounded-xl mr-4" style={{ backgroundColor: "rgba(37,99,235,0.1)", borderWidth: 1, borderColor: "rgba(37,99,235,0.2)" }}>
                    <Ionicons name="location" size={20} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-textDark tracking-tight">{item.stopName}</Text>
                    <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mt-1">Order: {item.order}</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4 bg-slate-50 p-4 rounded-xl border border-border">
                <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Location Details</Text>
                <Text className="text-textDark text-sm leading-relaxed font-medium">{item.location}</Text>
              </View>

              {user?.role === "admin" && (
                <View className="flex-row justify-between mt-2 gap-3">
                  <AppButton
                    title="Edit Stop"
                    variant="secondary"
                    className="flex-1"
                    onPress={() =>
                      navigation.navigate("StopForm", {
                        routeId,
                        stopData: item,
                      })
                    }
                  />
                  <AppButton
                    title="Delete Stop"
                    variant="danger"
                    className="flex-1"
                    onPress={() => handleDeleteStop(item._id)}
                  />
                </View>
              )}
            </AppCard>
          )}
        />
      </View>
    </AppLayout>
  );
};

export default StopListScreen;