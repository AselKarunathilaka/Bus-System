import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import LiquidBackground from "../components/LiquidBackground";
import { getGreeting } from "../utils/timeUtils";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row mr-4 space-x-4">
          <TouchableOpacity onPress={() => navigation.navigate("Routes")}>
            <Ionicons name="map-outline" size={24} color="#3567e0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(isAdmin ? "ScheduleList" : "UserScheduleList")}>
            <Ionicons name="calendar-outline" size={24} color="#3567e0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Buses")}>
            <Ionicons name="bus-outline" size={24} color="#3567e0" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isAdmin]);

  return (
    <LiquidBackground>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingTop: Platform.OS === 'web' ? 20 : 50 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Banner (Glass style) */}
        <GlassCard className="mb-4">
          <View className="bg-primary/20 self-start px-2 py-1 rounded-full mb-2 border border-primary/30">
            <Text className="text-primary font-sans text-[10px] font-bold tracking-widest uppercase">QuickBus Portal</Text>
          </View>
          <Text className="text-2xl font-sans font-extrabold text-white mb-1 tracking-tight">
            {getGreeting(user?.fullName)}
          </Text>
          <Text className="text-xs font-sans text-slate-300 font-medium leading-relaxed">
            Experience the all-new vibrant glass interface.
          </Text>
        </GlassCard>

        {/* Profile Overview (GlassCard) */}
        <GlassCard className="mb-4 p-4">
          <Text className="text-base font-sans font-bold text-white mb-3 tracking-tight">
            System Access
          </Text>
          <View className="flex-row items-center mb-2">
            <View className="bg-[rgba(255,255,255,0.4)] w-8 h-8 rounded-full items-center justify-center mr-3 border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="person" size={14} color="#2563EB" />
            </View>
            <View>
              <Text className="text-[10px] font-sans text-slate-300 font-bold uppercase tracking-widest">Name</Text>
              <Text className="text-sm font-sans text-slate-100 font-bold">{user?.fullName || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <View className="bg-[rgba(255,255,255,0.4)] w-8 h-8 rounded-full items-center justify-center mr-3 border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="mail" size={14} color="#2563EB" />
            </View>
            <View>
              <Text className="text-[10px] font-sans text-slate-300 font-bold uppercase tracking-widest">Email</Text>
              <Text className="text-sm font-sans text-slate-100 font-bold">{user?.email || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="bg-[rgba(255,255,255,0.4)] w-8 h-8 rounded-full items-center justify-center mr-3 border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="shield-checkmark" size={14} color="#2563EB" />
            </View>
            <View>
              <Text className="text-[10px] font-sans text-slate-300 font-bold uppercase tracking-widest">Role</Text>
              <Text className="text-sm font-sans text-slate-100 font-bold">{user?.role || "N/A"}</Text>
            </View>
          </View>
        </GlassCard>

        {isAdmin ? (
          <>
            <Text className="text-lg font-sans font-bold text-white mb-3 tracking-tight">
              Admin Control Panel
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] mb-3">
                <GlassButton
                  title="Routes"
                  className="flex-col h-24 border border-blue-400/30"
                  style={{ backgroundColor: "#3b82f6" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="map" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("Routes")}
                />
              </View>

              <View className="w-[48%] mb-3">
                <GlassButton
                  title="Buses"
                  className="flex-col h-24 border border-purple-400/30"
                  style={{ backgroundColor: "#8b5cf6" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="bus" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("Buses")}
                />
              </View>

              <View className="w-[48%] mb-3">
                <GlassButton
                  title="Schedules"
                  className="flex-col h-24 border border-amber-400/30"
                  style={{ backgroundColor: "#f59e0b" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="calendar" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("ScheduleList")}
                />
              </View>

              <View className="w-[48%] mb-3">
                <GlassButton
                  title="Bookings"
                  className="flex-col h-24 border border-emerald-400/30"
                  style={{ backgroundColor: "#10b981" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="receipt" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("BookingsTab")}
                />
              </View>

              <View className="w-[48%] mb-3">
                <GlassButton
                  title="Create Booking"
                  className="flex-col h-24 border border-sky-400/30"
                  style={{ backgroundColor: "#0ea5e9" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold text-center shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="ticket" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("UserScheduleList")}
                />
              </View>

              <View className="w-[48%] mb-3">
                <GlassButton
                  title="Analytics"
                  className="flex-col h-24 border border-indigo-400/30"
                  style={{ backgroundColor: "#6366f1" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold text-center shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="bar-chart" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("AdminDashboard")}
                />
              </View>

              <View className="w-[48%] mb-3">
                <GlassButton
                  title="System Guide"
                  className="flex-col h-24 border border-cyan-400/30"
                  style={{ backgroundColor: "#06b6d4" }}
                  textClassName="mt-2 text-sm font-sans text-[#FFFFFF] font-bold text-center shadow-sm"
                  icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="book" size={24} color="#FFFFFF" /></View>}
                  onPress={() => navigation.navigate("AdminGuide")}
                />
              </View>

            </View>
          </>
        ) : (
          <>
            <GlassCard className="mb-6 border-[1.5px] border-white/60 bg-white/95 p-5">
              <Text className="text-xl font-sans font-extrabold text-[#0F172A] mb-4">Find a Trip</Text>
              
              <View className="mb-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="location" size={20} color="#2563EB" />
                <Text className="ml-3 font-semibold text-[#64748B]">Leaving from...</Text>
              </View>

              <View className="mb-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="location" size={20} color="#059669" />
                <Text className="ml-3 font-semibold text-[#64748B]">Going to...</Text>
              </View>
              
              <View className="mb-5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="calendar" size={20} color="#1D4ED8" />
                <Text className="ml-3 font-semibold text-[#64748B]">Date of journey</Text>
              </View>

              <TouchableOpacity 
                className="bg-blue-600 rounded-xl py-4 flex-row justify-center items-center shadow-md shadow-blue-600/30"
                activeOpacity={0.7}
                onPress={() => navigation.navigate("UserScheduleList")}
              >
                <Ionicons name="search" size={20} color="white" />
                <Text className="text-white font-extrabold text-base ml-2 tracking-wide uppercase">Search Buses</Text>
              </TouchableOpacity>
            </GlassCard>

            <Text className="text-lg font-sans font-bold text-white mb-3 tracking-tight">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between mb-2">
              <TouchableOpacity className="w-[48%] bg-white/10 border border-white/30 rounded-2xl p-4 mb-3 items-center shadow-sm" onPress={() => navigation.navigate("UserScheduleList")} activeOpacity={0.7}>
                <Ionicons name="ticket" size={24} color="#10b981" />
                <Text className="text-white font-bold mt-2">Book Ticket</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-[48%] bg-white/10 border border-white/30 rounded-2xl p-4 mb-3 items-center shadow-sm" onPress={() => navigation.navigate("BookingsTab")} activeOpacity={0.7}>
                <Ionicons name="receipt" size={24} color="#f59e0b" />
                <Text className="text-white font-bold mt-2">My Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-[48%] bg-white/10 border border-white/30 rounded-2xl p-4 mb-3 items-center shadow-sm" onPress={() => navigation.navigate("Routes")} activeOpacity={0.7}>
                <Ionicons name="map" size={24} color="#0ea5e9" />
                <Text className="text-white font-bold mt-2">Routes</Text>
              </TouchableOpacity>
            </View>

            <GlassCard className="mb-4 border-[1.5px] border-white/20 bg-[rgba(255,255,255,0.05)] p-5 items-center justify-center">
              <Ionicons name="bus-outline" size={32} color="rgba(255,255,255,0.4)" className="mb-2" />
              <Text className="text-white font-bold mb-1">Upcoming Trip</Text>
              <Text className="text-slate-300 text-xs text-center">Your upcoming bookings will appear here.</Text>
            </GlassCard>
          </>
        )}

        <TouchableOpacity
          className="flex-row items-center justify-center py-4 mt-4 bg-[#B91C1C] rounded-2xl"
          onPress={logout}
        >
          <Ionicons name="power" size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-base ml-2">Secure Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </LiquidBackground>
  );
};

export default HomeScreen;