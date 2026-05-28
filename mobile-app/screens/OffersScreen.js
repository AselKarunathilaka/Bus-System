import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";

const offers = [
  {
    id: "1",
    title: "Weekend Getaway 🌴",
    description: "Get 15% off on all inter-city bookings made for Saturday or Sunday travels. Perfect for a quick break!",
    code: "WKND15",
    color: "#10b981", // Emerald
    icon: "calendar-outline"
  },
  {
    id: "2",
    title: "New User Welcome 🎁",
    description: "First time booking with QuickBus? Use this code at checkout to get a flat LKR 500 discount on your first journey.",
    code: "WELCOME500",
    color: "#3b82f6", // Blue
    icon: "gift-outline"
  },
  {
    id: "3",
    title: "Family Pack 🎉",
    description: "Booking for 4 or more people? Enjoy a 10% group discount on your total fare automatically applied at checkout.",
    code: "AUTO-APPLIED",
    color: "#f59e0b", // Amber
    icon: "people-outline"
  },
  {
    id: "4",
    title: "Night Owl Express 🌙",
    description: "Save 20% on all overnight bus schedules departing after 10:00 PM. Travel while you sleep!",
    code: "NIGHT20",
    color: "#8b5cf6", // Purple
    icon: "moon-outline"
  }
];

const OffersScreen = ({ navigation }) => {
  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white tracking-tight">Offers & Deals</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-slate-300 text-sm mb-6 leading-relaxed">
            Apply these exclusive promo codes at checkout to save on your upcoming journeys with QuickBus!
          </Text>

          {offers.map((offer) => (
            <GlassCard key={offer.id} className="mb-4">
              <View className="flex-row items-center mb-3 border-b border-white/20 pb-3">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3 border border-white/30"
                  style={{ backgroundColor: offer.color + '40' }} // 40 hex is 25% opacity
                >
                  <Ionicons name={offer.icon} size={20} color={offer.color} />
                </View>
                <Text className="text-lg font-bold text-white flex-1">{offer.title}</Text>
              </View>
              
              <Text className="text-slate-300 text-sm leading-relaxed mb-4">
                {offer.description}
              </Text>
              
              <View className="bg-slate-900/50 rounded-xl p-3 flex-row items-center justify-between border border-white/10">
                <Text className="text-slate-400 text-xs uppercase font-bold tracking-widest">Promo Code</Text>
                <Text className="text-white font-black text-lg tracking-widest">{offer.code}</Text>
              </View>
            </GlassCard>
          ))}
        </ScrollView>
      </View>
    </LiquidBackground>
  );
};

export default OffersScreen;
