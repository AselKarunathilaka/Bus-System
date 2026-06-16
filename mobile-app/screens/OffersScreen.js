import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";

const offers = [
  {
    id: "1",
    title: "Weekend Getaway 🌴",
    description: "Get 15% off on all inter-city bookings made for Saturday or Sunday travels. Perfect for a quick break!",
    code: "COMING SOON",
    color: "#10b981", // Emerald
    icon: "calendar-outline"
  },
  {
    id: "2",
    title: "New User Welcome 🎁",
    description: "First time booking with QuickBus? Use this code at checkout to get a flat LKR 500 discount on your first journey.",
    code: "COMING SOON",
    color: "#3b82f6", // Blue
    icon: "gift-outline"
  },
  {
    id: "3",
    title: "Family Pack 🎉",
    description: "Booking for 4 or more people? Enjoy a 10% group discount on your total fare automatically applied at checkout.",
    code: "COMING SOON",
    color: "#f59e0b", // Amber
    icon: "people-outline"
  },
  {
    id: "4",
    title: "Night Owl Express 🌙",
    description: "Save 20% on all overnight bus schedules departing after 10:00 PM. Travel while you sleep!",
    code: "COMING SOON",
    color: "#8b5cf6", // Purple
    icon: "moon-outline"
  }
];

const OffersScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Offers & Deals</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="text-textMuted font-medium mb-8 leading-relaxed max-w-2xl">
            Preview upcoming QuickBus rewards. Promotions are not yet applied during checkout, so no discount is included in current booking totals.
          </Text>

          <View className="flex-row flex-wrap gap-4">
            {offers.map((offer) => (
              <AppCard key={offer.id} className="mb-4 flex-1 min-w-[300px]">
                <View className="flex-row items-center mb-4 border-b border-border pb-4">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: offer.color + '15' }}
                  >
                    <Ionicons name={offer.icon} size={20} color={offer.color} />
                  </View>
                  <Text className="text-lg font-bold text-textDark flex-1">{offer.title}</Text>
                </View>
                
                <Text className="text-textMuted text-sm leading-relaxed mb-6">
                  {offer.description}
                </Text>
                
                <View className="bg-slate-50 rounded-xl p-4 flex-row items-center justify-between border border-border">
                  <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Availability</Text>
                  <Text className="text-textDark font-black text-base tracking-widest">{offer.code}</Text>
                </View>
              </AppCard>
            ))}
          </View>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default OffersScreen;
