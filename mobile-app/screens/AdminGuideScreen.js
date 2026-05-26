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
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-textDark shadow-sm tracking-tight">System Guide</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={20} color="#2F80ED" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <GlassCard className="mb-6 border-[rgba(255,255,255,0.8)]">
            <Text className="text-2xl font-black text-primary mb-3 tracking-tight">Welcome to QuickBus Admin 🚍</Text>
            <Text className="text-textDark text-base leading-relaxed font-medium">
              This detailed guide will walk you through the standard operating procedures for managing the bus booking system. 
              Our new Liquid Glass interface is designed to make management operations fast, intuitive, and error-free.
            </Text>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="map" size={28} color="#2F80ED" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">1. Creating a New Route</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              Routes define the physical path between a starting location and an ending destination. Without routes, you cannot assign buses or schedules.
            </Text>
            <Text className="text-textDark font-bold mb-2">Step-by-Step Guide:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Navigate to the <Text className="font-bold text-primary">Routes</Text> section from the Home screen.</Text>
              <Text className="text-textMuted text-sm mb-2">• Click the <Text className="font-bold text-[#059669]">Add New Route</Text> button at the bottom of the list.</Text>
              <Text className="text-textMuted text-sm mb-2">• Enter the Route Name (e.g., "Colombo-Kandy Express").</Text>
              <Text className="text-textMuted text-sm mb-2">• Specify the exact <Text className="font-bold text-textDark">Start Location</Text> and <Text className="font-bold text-textDark">End Location</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• Enter the total Distance (in KM) and the Base Price in LKR.</Text>
              <Text className="text-textMuted text-sm mb-2">• Click <Text className="font-bold text-primary">Create Route</Text>.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="location" size={28} color="#9333ea" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">2. Adding Stops to a Route</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              Once a route is created, you must add intermediate boarding/dropping points (Stops). The system calculates journey segments based on these stops.
            </Text>
            <Text className="text-textDark font-bold mb-2">Step-by-Step Guide:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Open the <Text className="font-bold text-primary">Routes</Text> list and find your newly created route.</Text>
              <Text className="text-textMuted text-sm mb-2">• Click the <Text className="font-bold text-textDark">Manage Stops</Text> button on that specific route card.</Text>
              <Text className="text-textMuted text-sm mb-2">• Click the <Text className="font-bold text-[#059669]">Add Stop</Text> button.</Text>
              <Text className="text-textMuted text-sm mb-2">• Define the Stop Name (e.g., "Kadawatha Bus Stand").</Text>
              <Text className="text-textMuted text-sm mb-2">• Provide a specific Location / Landmark and set its <Text className="font-bold text-textDark">Order</Text> (1, 2, 3...) to determine the sequence.</Text>
              <Text className="text-textMuted text-sm mb-2">• Save the stop. Repeat this for all intermediate towns.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="bus" size={28} color="#d97706" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">3. Managing the Bus Fleet</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              Before a schedule can be created, you must have active buses registered in your fleet.
            </Text>
            <Text className="text-textDark font-bold mb-2">Step-by-Step Guide:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Go to the <Text className="font-bold text-[#d97706]">Buses</Text> section.</Text>
              <Text className="text-textMuted text-sm mb-2">• Click <Text className="font-bold text-[#059669]">Add New Bus</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• Enter standard identifiers: Bus Name (Nickname), License Plate, and Contact Number.</Text>
              <Text className="text-textMuted text-sm mb-2">• Select the Bus Type (AC, Non-AC, Luxury) and <Text className="font-bold text-textDark">Seat Count</Text>. The Seat Count will dictate how many tickets can be booked.</Text>
              <Text className="text-textMuted text-sm mb-2">• Optionally, enter Driver and Conductor details for operational tracking.</Text>
              <Text className="text-textMuted text-sm mb-2">• To temporarily pause operations for a bus, set its status to <Text className="font-bold text-[#d97706]">Maintenance</Text>.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="calendar" size={28} color="#db2777" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">4. Creating a Schedule</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              Schedules are the actual "Trips" that customers see and book. They link a physical <Text className="font-bold text-primary">Route</Text> to a physical <Text className="font-bold text-[#d97706]">Bus</Text> at a specific Date and Time.
            </Text>
            <Text className="text-textDark font-bold mb-2">Step-by-Step Guide:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Go to the <Text className="font-bold text-[#db2777]">Schedules</Text> section.</Text>
              <Text className="text-textMuted text-sm mb-2">• Click <Text className="font-bold text-[#059669]">Add New Schedule</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• From the dropdowns, carefully select the desired Route and the assigned Bus.</Text>
              <Text className="text-textMuted text-sm mb-2">• Use the Date Picker to set the exact <Text className="font-bold text-textDark">Departure Date</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• Type in the Departure Time and Estimated Arrival Time (e.g., "08:30 AM").</Text>
              <Text className="text-textMuted text-sm mb-2">• Save the schedule. It is now instantly live and available for customer bookings!</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="ticket" size={28} color="#059669" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">5. Monitoring Bookings</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              As customers book tickets, their reservations appear instantly in the Bookings hub.
            </Text>
            <Text className="text-textDark font-bold mb-2">How it works:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Navigate to the <Text className="font-bold text-[#059669]">Bookings</Text> tab.</Text>
              <Text className="text-textMuted text-sm mb-2">• Here, you can view digital tickets containing the passenger's details, selected seat numbers, and total fare paid.</Text>
              <Text className="text-textMuted text-sm mb-2">• You can cancel a customer's booking if requested. This immediately frees up the seats on that schedule for other customers.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="bar-chart" size={28} color="#2F80ED" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">6. Dashboard & Analytics</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              The <Text className="font-bold text-primary">Analytics</Text> dashboard gives you a high-level overview of business performance.
            </Text>
            <Text className="text-textDark font-bold mb-2">Features:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• <Text className="font-bold text-textDark">Live Metrics:</Text> View Total Revenue, Active Routes, and Fleet Status in real-time (updates every 15s).</Text>
              <Text className="text-textMuted text-sm mb-2">• <Text className="font-bold text-textDark">Date Filtering:</Text> Select a Start and End date to filter the revenue and bookings metrics to a specific period.</Text>
              <Text className="text-textMuted text-sm mb-2">• <Text className="font-bold text-textDark">PDF Export:</Text> Click "Export PDF" in the top right to instantly generate and share an executive report of your current dashboard data.</Text>
            </View>
          </GlassCard>

        </ScrollView>
      </View>
    </LiquidBackground>
  );
};

export default AdminGuideScreen;
