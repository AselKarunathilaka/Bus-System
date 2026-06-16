import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";

const MetricCard = ({ icon, color, value, label }) => (
  <View className="w-[48%] mb-4">
    <AppCard className="p-5 h-36 justify-between overflow-hidden">
      <View
        className="w-11 h-11 rounded-2xl items-center justify-center"
        style={{ backgroundColor: `${color}18` }}
      >
        <Ionicons name={icon} size={23} color={color} />
      </View>
      <View>
        <Text className="text-textDark font-black text-2xl" numberOfLines={1}>
          {value}
        </Text>
        <Text className="text-textMuted text-[10px] font-bold uppercase tracking-widest mt-1">
          {label}
        </Text>
      </View>
    </AppCard>
  </View>
);

const TravelStatsScreen = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await api.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((booking) => booking.status === "Confirmed");
    const destinationCounts = {};

    const distance = confirmed.reduce((total, booking) => {
      const route = booking.scheduleId?.routeId;
      if (route?.endLocation) {
        destinationCounts[route.endLocation] =
          (destinationCounts[route.endLocation] || 0) + 1;
      }
      return total + Number(route?.distanceKm || 0);
    }, 0);

    const spend = confirmed.reduce(
      (total, booking) => total + Number(booking.totalPrice || 0),
      0
    );

    const topDestination =
      Object.entries(destinationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Not yet";

    const points = Math.floor(spend / 100);
    const tier =
      confirmed.length >= 20
        ? "Platinum"
        : confirmed.length >= 10
          ? "Gold"
          : confirmed.length >= 5
            ? "Silver"
            : "Explorer";

    return {
      trips: confirmed.length,
      distance,
      spend,
      topDestination,
      points,
      tier,
    };
  }, [bookings]);

  if (loading) {
    return (
      <AppLayout useSafeArea>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="text-textMuted font-semibold mt-4">Calculating your journeys...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 p-6 max-w-4xl w-full self-center">
        <View className="flex-row items-center mb-7">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2.5 bg-white rounded-full border border-white"
          >
            <Ionicons name="arrow-back" size={22} color="#475569" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">
              Travel Insights
            </Text>
            <Text className="text-textMuted text-xs font-semibold mt-1">
              Based on your confirmed QuickBus bookings
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchBookings();
              }}
              tintColor="#4F46E5"
            />
          }
        >
          <View className="rounded-[32px] overflow-hidden mb-7 bg-slate-950 p-7">
            <View
              className="absolute w-48 h-48 rounded-full -right-16 -top-20"
              style={{ backgroundColor: "rgba(99, 102, 241, 0.34)" }}
            />
            <View
              className="absolute w-40 h-40 rounded-full -left-20 -bottom-24"
              style={{ backgroundColor: "rgba(6, 182, 212, 0.22)" }}
            />
            <View className="flex-row justify-between items-start mb-10">
              <View>
                <Text className="text-cyan-300 text-[10px] font-bold uppercase tracking-[3px]">
                  QuickBus {stats.tier}
                </Text>
                <Text className="text-white text-2xl font-black mt-2">
                  {user?.fullName || "Traveller"}
                </Text>
              </View>
              <View className="w-12 h-12 rounded-2xl bg-white/10 items-center justify-center">
                <Ionicons name="sparkles" size={24} color="#67E8F9" />
              </View>
            </View>

            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Reward points
            </Text>
            <Text className="text-white text-5xl font-black tracking-tighter mt-1">
              {stats.points.toLocaleString()}
            </Text>
            <Text className="text-slate-400 text-xs mt-3">
              1 point earned for every LKR 100 spent
            </Text>
          </View>

          <Text className="text-lg font-bold text-textDark mb-4">Your journey at a glance</Text>
          <View className="flex-row flex-wrap justify-between">
            <MetricCard icon="bus" color="#10B981" value={stats.trips} label="Confirmed trips" />
            <MetricCard
              icon="map"
              color="#8B5CF6"
              value={`${stats.distance.toLocaleString()} km`}
              label="Distance booked"
            />
            <MetricCard
              icon="wallet"
              color="#F59E0B"
              value={`LKR ${stats.spend.toLocaleString()}`}
              label="Total booked"
            />
            <MetricCard
              icon="location"
              color="#F43F5E"
              value={stats.topDestination}
              label="Top destination"
            />
          </View>

          <AppCard className="mt-2 overflow-hidden">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center mr-4">
                <Ionicons
                  name={stats.trips ? "trophy" : "compass"}
                  size={24}
                  color="#4F46E5"
                />
              </View>
              <View className="flex-1">
                <Text className="text-textDark font-bold text-base">
                  {stats.trips
                    ? `${stats.trips} confirmed ${stats.trips === 1 ? "journey" : "journeys"}`
                    : "Your travel story starts here"}
                </Text>
                <Text className="text-textMuted text-xs leading-5 mt-1">
                  {stats.trips
                    ? "Keep booking to unlock higher traveller tiers and more reward points."
                    : "Book your first trip and this dashboard will fill with real travel insights."}
                </Text>
              </View>
            </View>
          </AppCard>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default TravelStatsScreen;
