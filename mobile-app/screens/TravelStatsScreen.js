import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";

const { width } = Dimensions.get("window");

const TravelStatsScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <View className="flex-1 p-6 max-w-4xl w-full self-center">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Travel Stats</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Main Loyalty Card */}
          <AppCard className="mb-6 bg-slate-900 border-slate-800 p-6 overflow-hidden">
            <View className="absolute top-0 right-0" style={{ opacity: 0.1 }}>
              <Ionicons name="star" size={120} color="#F59E0B" style={{ transform: [{ translateX: 20 }, { translateY: -20 }] }} />
            </View>
            <View className="flex-row items-center justify-between mb-6 z-10">
              <View>
                <Text className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-1">QuickBus Gold Member</Text>
                <Text className="text-slate-400 text-xs font-medium">Since Jan 2026</Text>
              </View>
              <Ionicons name="star" size={32} color="#F59E0B" />
            </View>
            
            <View className="rounded-2xl p-5 z-10" style={{ backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
              <Text className="text-slate-300 text-xs font-bold tracking-widest uppercase text-center mb-2">Available Loyalty Points</Text>
              <Text className="text-white text-5xl font-black tracking-tighter text-center">1,250</Text>
            </View>
          </AppCard>

          <Text className="text-lg font-sans font-bold text-textDark mb-4 tracking-tight">All-Time Metrics</Text>
          
          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="w-[48%] mb-4">
              <AppCard className="p-5 items-center h-36 justify-center border-t-4 border-t-emerald-500">
                <Ionicons name="bus" size={28} color="#10B981" className="mb-3" />
                <Text className="text-textDark font-black text-3xl mb-1">14</Text>
                <Text className="text-textMuted text-[10px] font-bold uppercase tracking-widest">Trips Taken</Text>
              </AppCard>
            </View>
            <View className="w-[48%] mb-4">
              <AppCard className="p-5 items-center h-36 justify-center border-t-4 border-t-purple-500">
                <Ionicons name="map" size={28} color="#A855F7" className="mb-3" />
                <Text className="text-textDark font-black text-3xl mb-1">1,450</Text>
                <Text className="text-textMuted text-[10px] font-bold uppercase tracking-widest">KM Traveled</Text>
              </AppCard>
            </View>
            <View className="w-[48%] mb-4">
              <AppCard className="p-5 items-center h-36 justify-center border-t-4 border-t-amber-500">
                <Ionicons name="time" size={28} color="#F59E0B" className="mb-3" />
                <Text className="text-textDark font-black text-3xl mb-1">38</Text>
                <Text className="text-textMuted text-[10px] font-bold uppercase tracking-widest">Hours Saved</Text>
              </AppCard>
            </View>
            <View className="w-[48%] mb-4">
              <AppCard className="p-5 items-center h-36 justify-center border-t-4 border-t-rose-500">
                <Ionicons name="heart" size={28} color="#F43F5E" className="mb-3" />
                <Text className="text-textDark font-black text-xl text-center mb-1">Colombo</Text>
                <Text className="text-textMuted text-[10px] font-bold uppercase tracking-widest text-center mt-1">Top Destination</Text>
              </AppCard>
            </View>
          </View>

          <AppCard className="bg-amber-50 border-amber-100">
            <Text className="text-textDark font-bold text-base mb-4">Recent Milestone</Text>
            <View className="flex-row items-center">
              <View className="bg-white p-3 rounded-xl mr-4">
                <Ionicons name="trophy" size={24} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="text-textDark font-bold mb-1">10th Ride Completed!</Text>
                <Text className="text-textMuted text-xs leading-relaxed">You earned an extra 500 bonus points for hitting this milestone. Keep traveling!</Text>
              </View>
            </View>
          </AppCard>

        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default TravelStatsScreen;
