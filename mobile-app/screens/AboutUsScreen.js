import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import { Ionicons } from "@expo/vector-icons";

const AboutUsScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
            <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-textDark tracking-tight flex-1">About Us</Text>
        </View>

        <AppCard className="mb-8 overflow-hidden p-0 border-0">
          <View className="h-32 items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.1)" }}>
             <Ionicons name="bus" size={64} color="#2563EB" />
          </View>
          <View className="p-6">
            <Text className="text-2xl font-black text-textDark mb-2">QuickBus</Text>
            <Text className="text-textMuted leading-6 text-sm">
              We are revolutionizing intercity travel in Sri Lanka. QuickBus is an innovative, fast, and reliable digital platform that brings the power of instant ticket booking directly to your fingertips.
            </Text>
          </View>
        </AppCard>

        <Text className="text-lg font-bold text-textDark mb-4">Our Mission</Text>
        <AppCard className="mb-8 p-5 border-l-4 border-l-emerald-500 bg-emerald-50">
          <Text className="text-textDark leading-6 text-sm font-medium">
            To provide a seamless, stress-free travel experience by connecting passengers with top-rated bus operators through a transparent and easy-to-use digital ecosystem.
          </Text>
        </AppCard>

        <Text className="text-lg font-bold text-textDark mb-4">Why Choose Us?</Text>
        
        <View className="flex-row mb-4">
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
            <Ionicons name="time" size={24} color="#2563EB" />
          </View>
          <View className="flex-1 justify-center">
            <Text className="font-bold text-textDark mb-1">Time Saving</Text>
            <Text className="text-xs text-textMuted">No more standing in long queues at the bus stand.</Text>
          </View>
        </View>

        <View className="flex-row mb-4">
          <View className="w-12 h-12 rounded-full bg-indigo-100 items-center justify-center mr-4">
            <Ionicons name="shield-checkmark" size={24} color="#4F46E5" />
          </View>
          <View className="flex-1 justify-center">
            <Text className="font-bold text-textDark mb-1">Secure & Reliable</Text>
            <Text className="text-xs text-textMuted">Verified operators and a 100% secure platform.</Text>
          </View>
        </View>

        <View className="flex-row mb-8">
          <View className="w-12 h-12 rounded-full bg-amber-100 items-center justify-center mr-4">
            <Ionicons name="wallet" size={24} color="#D97706" />
          </View>
          <View className="flex-1 justify-center">
            <Text className="font-bold text-textDark mb-1">Transparent Pricing</Text>
            <Text className="text-xs text-textMuted">Pay exactly what is shown. No hidden fees.</Text>
          </View>
        </View>
        
        <View className="items-center mt-4">
          <Text className="text-xs font-bold text-textMuted uppercase tracking-widest">Version 1.0.0</Text>
          <Text className="text-[10px] text-slate-400 mt-1">© 2026 QuickBus All rights reserved.</Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default AboutUsScreen;
