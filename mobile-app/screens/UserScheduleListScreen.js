/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import ScheduleCard from "../components/ui/ScheduleCard";

const UserScheduleListScreen = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safely extract search params from navigation route
  const searchParams = route?.params || {};
  const { from, to, date } = searchParams;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        let activeSchedules = response.data.filter((s) => s.status !== "Cancelled");

        // Apply filters if they exist
        if (from) {
          activeSchedules = activeSchedules.filter(s => s.routeId?.startLocation === from);
        }
        if (to) {
          activeSchedules = activeSchedules.filter(s => s.routeId?.endLocation === to);
        }
        if (date) {
          activeSchedules = activeSchedules.filter(s => {
            const schedDate = new Date(s.departureDate).toISOString().split('T')[0];
            return schedDate === date;
          });
        }

        setSchedules(activeSchedules);
      } catch (error) {
        Alert.alert("Error", "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [token, from, to, date]);

  const renderItem = ({ item }) => {
    return <ScheduleCard item={item} navigation={navigation} />;
  };

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2 bg-white rounded-full border border-border">
              <Ionicons name="arrow-back" size={20} color="#64748B" />
            </TouchableOpacity>
            <View>
              <Text className="text-2xl font-black text-textDark tracking-tight">Available Buses</Text>
              {(from || to || date) && (
                <Text className="text-primary text-xs font-bold mt-1">
                  Filtered: {from || 'Any'} → {to || 'Any'} {date ? `| ${date}` : ''}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2 bg-white rounded-full border border-border">
            <Ionicons name="home" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading available trips...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View className="items-center justify-center mt-32 bg-slate-50 p-10 rounded-3xl border border-slate-200 border-dashed">
            <View className="w-20 h-20 rounded-full bg-white border border-slate-200 items-center justify-center mb-4 shadow-sm">
              <Ionicons name="bus-outline" size={40} color="#94A3B8" />
            </View>
            <Text className="text-textDark mt-2 font-bold text-xl tracking-tight">No trips found</Text>
            <Text className="text-textMuted text-sm mt-2 text-center max-w-xs">
              We couldn&apos;t find any schedules matching your criteria. Please try different dates or locations.
            </Text>
            <TouchableOpacity 
              className="mt-6 bg-slate-100 px-6 py-2 rounded-full border border-slate-200"
              onPress={() => navigation.goBack()}
            >
              <Text className="text-textDark font-medium">Clear Filters</Text>
            </TouchableOpacity>
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

export default UserScheduleListScreen;
