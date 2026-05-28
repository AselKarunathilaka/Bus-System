import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";

const { width } = Dimensions.get("window");

const TravelStatsScreen = ({ navigation }) => {
  return (
    <LiquidBackground>
      <View className="flex-1 p-5">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="arrow-back" size={24} color="#2F80ED" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white tracking-tight">Travel Stats</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* Main Loyalty Card */}
          <GlassCard className="mb-6 border-[#3b82f6]/50 bg-[#3b82f6]/10">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-white text-sm font-bold uppercase tracking-widest mb-1">QuickBus Gold Member</Text>
                <Text className="text-slate-300 text-xs">Since Jan 2026</Text>
              </View>
              <Ionicons name="star" size={32} color="#f59e0b" />
            </View>
            
            <View className="bg-slate-900/40 rounded-2xl p-4 border border-white/10">
              <Text className="text-slate-400 text-xs font-bold tracking-widest uppercase text-center mb-1">Available Loyalty Points</Text>
              <Text className="text-white text-4xl font-black tracking-tighter text-center text-[#3b82f6]">1,250</Text>
            </View>
          </GlassCard>

          <Text className="text-lg font-sans font-bold text-white mb-3 tracking-tight">All-Time Metrics</Text>
          
          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="w-[48%] mb-4">
              <GlassCard className="p-4 items-center h-32 justify-center border-emerald-500/30">
                <Ionicons name="bus" size={28} color="#10b981" className="mb-2" />
                <Text className="text-white font-black text-2xl">14</Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Trips Taken</Text>
              </GlassCard>
            </View>
            <View className="w-[48%] mb-4">
              <GlassCard className="p-4 items-center h-32 justify-center border-purple-500/30">
                <Ionicons name="map" size={28} color="#8b5cf6" className="mb-2" />
                <Text className="text-white font-black text-2xl">1,450</Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">KM Traveled</Text>
              </GlassCard>
            </View>
            <View className="w-[48%] mb-4">
              <GlassCard className="p-4 items-center h-32 justify-center border-amber-500/30">
                <Ionicons name="time" size={28} color="#f59e0b" className="mb-2" />
                <Text className="text-white font-black text-2xl">38</Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Hours Safed</Text>
              </GlassCard>
            </View>
            <View className="w-[48%] mb-4">
              <GlassCard className="p-4 items-center h-32 justify-center border-rose-500/30">
                <Ionicons name="heart" size={28} color="#f43f5e" className="mb-2" />
                <Text className="text-white font-black text-lg text-center">Colombo</Text>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center mt-1">Top Destination</Text>
              </GlassCard>
            </View>
          </View>

          <GlassCard>
            <Text className="text-white font-bold text-base mb-3">Recent Milestone</Text>
            <View className="flex-row items-center">
              <View className="bg-amber-500/20 p-3 rounded-full mr-4 border border-amber-500/40">
                <Ionicons name="trophy" size={24} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold">10th Ride Completed!</Text>
                <Text className="text-slate-400 text-xs mt-1 leading-relaxed">You earned an extra 500 bonus points for hitting this milestone. Keep traveling!</Text>
              </View>
            </View>
          </GlassCard>

        </ScrollView>
      </View>
    </LiquidBackground>
  );
};

export default TravelStatsScreen;
