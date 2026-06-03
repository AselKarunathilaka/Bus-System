/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";

const UserGuideScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <View className="flex-1 p-6 max-w-4xl w-full self-center">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Help & Support</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <AppCard className="mb-6" style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}>
            <Text className="text-xl font-extrabold text-primary mb-2 tracking-tight">Welcome to QuickBus! 🚍</Text>
            <Text className="text-textDark text-sm leading-relaxed font-medium">
              We're here to help you get the most out of your travel experience. Below is a quick guide on how to navigate the app and book your next journey.
            </Text>
          </AppCard>

          <AppCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-border pb-3">
              <Ionicons name="ticket" size={24} color="#059669" className="mr-3" />
              <Text className="text-lg font-bold text-textDark">1. Booking a Ticket</Text>
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
          </AppCard>

          <AppCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-border pb-3">
              <Ionicons name="receipt" size={24} color="#D97706" className="mr-3" />
              <Text className="text-lg font-bold text-textDark">2. Viewing Your Tickets</Text>
            </View>
            <Text className="text-textMuted text-sm leading-relaxed mb-4">
              All your booked tickets are stored safely in the app. 
            </Text>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• Tap the <Text className="font-bold text-[#D97706]">Bookings</Text> tab at the bottom of the screen.</Text>
              <Text className="text-textMuted text-sm mb-2">• Here, you can present your digital ticket to the bus conductor before boarding.</Text>
              <Text className="text-textMuted text-sm mb-2">• The ticket includes your seat numbers and a unique Booking ID.</Text>
            </View>
          </AppCard>

          <AppCard className="mb-6">
            <View className="flex-row items-center mb-4 border-b border-border pb-3">
              <Ionicons name="map" size={24} color="#2563EB" className="mr-3" />
              <Text className="text-lg font-bold text-textDark">3. Checking Routes & Stops</Text>
            </View>
            <View className="pl-2">
              <Text className="text-textMuted text-sm mb-2">• If you want to see which towns a bus passes through, tap on <Text className="font-bold text-primary">Routes</Text>.</Text>
              <Text className="text-textMuted text-sm mb-2">• Tap <Text className="font-bold text-textDark">View Route Stops</Text> on any route to see the exact sequence of boarding points and landmarks.</Text>
            </View>
          </AppCard>

          <AppCard className="mb-6 bg-danger-bg" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            <View className="flex-row items-center mb-4 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: "rgba(239,68,68,0.2)" }}>
              <Ionicons name="call" size={24} color="#DC2626" className="mr-3" />
              <Text className="text-lg font-bold text-danger-text">Need More Help?</Text>
            </View>
            <Text className="text-danger-text text-sm leading-relaxed mb-4" style={{ opacity: 0.8 }}>
              If you have any issues with a booking or need to request a cancellation, please reach out to our support team:
            </Text>
            <View className="flex-row items-center mb-3">
              <View className="bg-white p-2 rounded-full mr-3">
                <Ionicons name="mail" size={16} color="#DC2626" />
              </View>
              <Text className="text-danger-text font-bold">support@quickbus.lk</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-white p-2 rounded-full mr-3">
                <Ionicons name="call" size={16} color="#DC2626" />
              </View>
              <Text className="text-danger-text font-bold">+94 11 234 5678</Text>
            </View>
          </AppCard>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default UserGuideScreen;
