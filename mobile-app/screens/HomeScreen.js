import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import LiquidBackground from "../components/LiquidBackground";

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
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        
        {/* Hero Banner (Glass style) */}
        <GlassCard className="mb-6">
          <View className="bg-white/10 self-start px-3 py-1.5 rounded-full mb-3 border border-white/10">
            <Text className="text-white text-xs font-bold">QuickBus Portal</Text>
          </View>
          <Text className="text-2xl font-bold text-white mb-2 tracking-tight">
            Welcome Back, {user?.fullName?.split(" ")[0] || "User"}
          </Text>
          <Text className="text-sm text-slate-300 font-medium leading-relaxed">
            The all-new dark glass interface. Sleek, fast, and stunningly modern.
          </Text>
        </GlassCard>

        {/* Profile Overview (GlassCard) */}
        <GlassCard className="mb-6">
          <Text className="text-lg font-bold text-white mb-4 tracking-tight">
            System Access
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center mr-4">
              <Ionicons name="person" size={18} color="#94a3b8" />
            </View>
            <View>
              <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Name</Text>
              <Text className="text-base text-white font-bold">{user?.fullName || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center mr-4">
              <Ionicons name="mail" size={18} color="#94a3b8" />
            </View>
            <View>
              <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Email</Text>
              <Text className="text-base text-white font-bold">{user?.email || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center mr-4">
              <Ionicons name="shield-checkmark" size={18} color="#94a3b8" />
            </View>
            <View>
              <Text className="text-xs text-slate-400 font-bold uppercase tracking-widest">Role</Text>
              <Text className="text-base text-white font-bold">{user?.role || "N/A"}</Text>
            </View>
          </View>
        </GlassCard>

        <Text className="text-xl font-bold text-white mb-4 tracking-tight">
          Control Panel
        </Text>

        {/* Grid Menu using GlassButtons */}
        <View className="flex-row flex-wrap justify-between">
          
          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Routes" : "Routes"}
              variant="glass"
              className="flex-col h-32"
              textClassName="mt-3 text-base"
              icon={<View className="bg-[#007AFF]/20 p-3 rounded-full border border-[#007AFF]/30"><Ionicons name="map" size={28} color="#38bdf8" /></View>}
              onPress={() => navigation.navigate("Routes")}
            />
          </View>

          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Buses" : "Buses"}
              variant="glass"
              className="flex-col h-32"
              textClassName="mt-3 text-base"
              icon={<View className="bg-[#007AFF]/20 p-3 rounded-full border border-[#007AFF]/30"><Ionicons name="bus" size={28} color="#38bdf8" /></View>}
              onPress={() => navigation.navigate("Buses")}
            />
          </View>

          {isAdmin && (
            <View className="w-[48%] mb-4">
              <GlassButton
                title="Schedules"
                variant="glass"
                className="flex-col h-32"
                textClassName="mt-3 text-base"
                icon={<View className="bg-[#007AFF]/20 p-3 rounded-full border border-[#007AFF]/30"><Ionicons name="calendar" size={28} color="#38bdf8" /></View>}
                onPress={() => navigation.navigate("ScheduleList")}
              />
            </View>
          )}

          <View className="w-[48%] mb-4">
            <GlassButton
              title="Book Ticket"
              variant="glass"
              className="flex-col h-32"
              textClassName="mt-3 text-base"
              icon={<View className="bg-[#007AFF]/20 p-3 rounded-full border border-[#007AFF]/30"><Ionicons name="ticket" size={28} color="#38bdf8" /></View>}
              onPress={() => navigation.navigate("UserScheduleList")}
            />
          </View>

          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Bookings" : "Bookings"}
              variant="glass"
              className="flex-col h-32"
              textClassName="mt-3 text-base"
              icon={<View className="bg-[#007AFF]/20 p-3 rounded-full border border-[#007AFF]/30"><Ionicons name="receipt" size={28} color="#38bdf8" /></View>}
              onPress={() => navigation.navigate("BookingsTab")}
            />
          </View>

          {isAdmin && (
            <View className="w-[48%] mb-4">
              <GlassButton
                title="Analytics"
                variant="glass"
                className="flex-col h-32"
                textClassName="mt-3 text-base text-center"
                icon={<View className="bg-[#007AFF]/20 p-3 rounded-full border border-[#007AFF]/30"><Ionicons name="bar-chart" size={28} color="#38bdf8" /></View>}
                onPress={() => navigation.navigate("AdminDashboard")}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center py-6 mt-4 bg-white/5 rounded-2xl border border-white/10"
          onPress={logout}
        >
          <Ionicons name="power" size={20} color="#f87171" />
          <Text className="text-red-400 font-bold text-base ml-2">Secure Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </LiquidBackground>
  );
};

export default HomeScreen;