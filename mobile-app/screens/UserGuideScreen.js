import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";

const UserGuideScreen = ({ navigation }) => {
  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-textDark shadow-sm tracking-tight">Help & Support</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
            <Ionicons name="home" size={20} color="#2F80ED" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <GlassCard className="mb-6 border-[rgba(255,255,255,0.8)]">
            <Text className="text-2xl font-black text-primary mb-3 tracking-tight">Welcome to QuickBus! 🚍</Text>
            <Text className="text-textDark text-base leading-relaxed font-medium">
              We're here to help you get the most out of your travel experience. Below is a quick guide on how to navigate the app and book your next journey.
            </Text>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="ticket" size={28} color="#059669" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">1. Booking a Ticket</Text>
            </View>
            <Text className="text-textDark font-bold mb-2">Step-by-Step Guide:</Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Tap on the <Text className="font-bold text-[#059669]">Book Ticket</Text> button from the Home screen.</Text>
              <Text className="text-textMuted text-sm mb-2">• Browse the available trips to find a schedule that suits you.</Text>
              <Text className="text-textMuted text-sm mb-2">• Tap <Text className="font-bold text-[#059669]">Select Seats</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• Choose your preferred seats from the graphical layout. Selected seats will turn dark green.</Text>
              <Text className="text-textMuted text-sm mb-2">• Enter the names and details for each passenger.</Text>
              <Text className="text-textMuted text-sm mb-2">• Confirm and pay! Your digital ticket is generated instantly.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="receipt" size={28} color="#d97706" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">2. Viewing Your Tickets</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              All your booked tickets are stored safely in the app. 
            </Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Tap the <Text className="font-bold text-[#d97706]">Bookings</Text> tab at the bottom of the screen.</Text>
              <Text className="text-textMuted text-sm mb-2">• Here, you can present your digital ticket to the bus conductor before boarding.</Text>
              <Text className="text-textMuted text-sm mb-2">• The ticket includes your seat numbers and a unique Booking ID.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-[rgba(255,255,255,0.5)] pb-3">
              <Ionicons name="map" size={28} color="#2F80ED" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">3. Checking Routes & Stops</Text>
            </View>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• If you want to see which towns a bus passes through, tap on <Text className="font-bold text-primary">Routes</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• Tap <Text className="font-bold text-textDark">View Route Stops</Text> on any route to see the exact sequence of boarding points and landmarks.</Text>
            </View>
          </GlassCard>

          <GlassCard className="mb-6 border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.1)]">
            <View className="flex-row items-center mb-4 border-b border-[rgba(220,38,38,0.2)] pb-3">
              <Ionicons name="call" size={28} color="#dc2626" className="mr-3" />
              <Text className="text-xl font-bold text-textDark ml-2">Need More Help?</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              If you have any issues with a booking or need to request a cancellation, please reach out to our support team:
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="mail" size={20} color="#2F80ED" />
              <Text className="text-textDark font-bold ml-2">support@quickbus.lk</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call" size={20} color="#2F80ED" />
              <Text className="text-textDark font-bold ml-2">+94 11 234 5678</Text>
            </View>
          </GlassCard>
        </ScrollView>
      </View>
    </LiquidBackground>
  );
};

export default UserGuideScreen;
