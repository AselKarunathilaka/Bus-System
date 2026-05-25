import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";

const AdminGuideScreen = ({ navigation }) => {
  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white shadow-sm tracking-tight">Admin Guide</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-white/10 p-2 rounded-full border border-white/10">
            <Ionicons name="home" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <GlassCard className="mb-4">
            <Text className="text-xl font-bold text-white mb-2">Welcome to QuickBus Admin 🚍</Text>
            <Text className="text-slate-300 text-sm leading-relaxed mb-2">
              This guide will help you understand how to manage the system effectively. Our Liquid Glass interface makes managing operations fast, visually clear, and deeply integrated.
            </Text>
          </GlassCard>

          <GlassCard className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="map" size={24} color="#7dd3fc" className="mr-2" />
              <Text className="text-lg font-bold text-white ml-2">1. Managing Routes & Stops</Text>
            </View>
            <Text className="text-slate-300 text-sm leading-relaxed mb-2">
              <Text className="font-bold text-emerald-400">Routes</Text> are the backbone of your system. Create a route by defining the Start and End locations, distance, and base price.
            </Text>
            <Text className="text-slate-300 text-sm leading-relaxed">
              Once a route is created, you must add <Text className="font-bold text-emerald-400">Stops</Text> to it. Go to 'Manage Stops' on any route card to add intermediate locations.
            </Text>
          </GlassCard>

          <GlassCard className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bus" size={24} color="#d8b4fe" className="mr-2" />
              <Text className="text-lg font-bold text-white ml-2">2. Managing the Fleet (Buses)</Text>
            </View>
            <Text className="text-slate-300 text-sm leading-relaxed mb-2">
              Add your vehicles in the <Text className="font-bold text-purple-400">Buses</Text> section. You will define the bus type (e.g. AC / Non-AC), total seat count, license plate, and the crew details.
            </Text>
            <Text className="text-slate-300 text-sm leading-relaxed">
              You can track if a bus is 'Available', 'Maintenance', or 'Inactive'.
            </Text>
          </GlassCard>

          <GlassCard className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar" size={24} color="#fda4af" className="mr-2" />
              <Text className="text-lg font-bold text-white ml-2">3. Creating Schedules</Text>
            </View>
            <Text className="text-slate-300 text-sm leading-relaxed mb-2">
              Schedules connect your <Text className="font-bold text-pink-400">Routes</Text> and your <Text className="font-bold text-pink-400">Buses</Text>.
            </Text>
            <Text className="text-slate-300 text-sm leading-relaxed">
              When creating a schedule, pick an existing route, assign an available bus, and set the departure date, departure time, and estimated arrival time.
            </Text>
          </GlassCard>

          <GlassCard className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="receipt" size={24} color="#fcd34d" className="mr-2" />
              <Text className="text-lg font-bold text-white ml-2">4. Monitoring Bookings</Text>
            </View>
            <Text className="text-slate-300 text-sm leading-relaxed mb-2">
              The <Text className="font-bold text-amber-400">Bookings</Text> tab allows you to see all customer reservations. You can filter them by status (Confirmed, Cancelled) and view seat numbers.
            </Text>
          </GlassCard>

          <GlassCard className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bar-chart" size={24} color="#93c5fd" className="mr-2" />
              <Text className="text-lg font-bold text-white ml-2">5. Analytics & Dashboard</Text>
            </View>
            <Text className="text-slate-300 text-sm leading-relaxed mb-2">
              Your <Text className="font-bold text-blue-400">Admin Dashboard</Text> offers real-time insights into system revenue, active buses, and a 7-day booking volume chart.
            </Text>
            <Text className="text-slate-300 text-sm leading-relaxed">
              You can export these metrics anytime by pressing the <Text className="font-bold text-white">Export PDF</Text> button in the top right corner.
            </Text>
          </GlassCard>
        </ScrollView>
      </View>
    </LiquidBackground>
  );
};

export default AdminGuideScreen;
