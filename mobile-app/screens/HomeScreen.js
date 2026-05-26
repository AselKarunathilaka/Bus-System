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
          <View className="bg-primary/20 self-start px-3 py-1.5 rounded-full mb-3 border border-primary/30">
            <Text className="text-primary text-xs font-bold tracking-widest uppercase">QuickBus Portal</Text>
          </View>
          <Text className="text-3xl font-extrabold text-textDark mb-2 tracking-tight">
            Welcome, {user?.fullName?.split(" ")[0] || "User"}
          </Text>
          <Text className="text-sm text-textMuted font-medium leading-relaxed">
            Experience the all-new vibrant glass interface. Sleek, fast, and stunningly colorful.
          </Text>
        </GlassCard>

        {/* Profile Overview (GlassCard) */}
        <GlassCard className="mb-6">
          <Text className="text-lg font-bold text-textDark mb-4 tracking-tight">
            System Access
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="bg-[rgba(255,255,255,0.4)] w-10 h-10 rounded-full items-center justify-center mr-4 border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="person" size={18} color="#2F80ED" />
            </View>
            <View>
              <Text className="text-xs text-textMuted font-bold uppercase tracking-widest">Name</Text>
              <Text className="text-base text-textDark font-bold">{user?.fullName || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="bg-[rgba(255,255,255,0.4)] w-10 h-10 rounded-full items-center justify-center mr-4 border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="mail" size={18} color="#2F80ED" />
            </View>
            <View>
              <Text className="text-xs text-textMuted font-bold uppercase tracking-widest">Email</Text>
              <Text className="text-base text-textDark font-bold">{user?.email || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="bg-[rgba(255,255,255,0.4)] w-10 h-10 rounded-full items-center justify-center mr-4 border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="shield-checkmark" size={18} color="#2F80ED" />
            </View>
            <View>
              <Text className="text-xs text-textMuted font-bold uppercase tracking-widest">Role</Text>
              <Text className="text-base text-textDark font-bold">{user?.role || "N/A"}</Text>
            </View>
          </View>
        </GlassCard>

        <Text className="text-xl font-bold text-textDark mb-4 tracking-tight">
          Control Panel
        </Text>

        {/* Grid Menu using GlassButtons */}
        <View className="flex-row flex-wrap justify-between">
          
          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Routes" : "Routes"}
              variant="glass"
              className="flex-col h-32 border-[#0ea5e9]/40 bg-[#0ea5e9]/10"
              textClassName="mt-3 text-base text-textDark"
              icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="map" size={28} color="#0ea5e9" /></View>}
              onPress={() => navigation.navigate("Routes")}
            />
          </View>

          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Buses" : "Buses"}
              variant="glass"
              className="flex-col h-32 border-[#a855f7]/40 bg-[#a855f7]/10"
              textClassName="mt-3 text-base text-textDark"
              icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="bus" size={28} color="#a855f7" /></View>}
              onPress={() => navigation.navigate("Buses")}
            />
          </View>

          {isAdmin && (
            <View className="w-[48%] mb-4">
              <GlassButton
                title="Schedules"
                variant="glass"
                className="flex-col h-32 border-[#f43f5e]/40 bg-[#f43f5e]/10"
                textClassName="mt-3 text-base text-textDark"
                icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="calendar" size={28} color="#f43f5e" /></View>}
                onPress={() => navigation.navigate("ScheduleList")}
              />
            </View>
          )}

          <View className="w-[48%] mb-4">
            <GlassButton
              title="Book Ticket"
              variant="glass"
              className="flex-col h-32 border-[#10b981]/40 bg-[#10b981]/10"
              textClassName="mt-3 text-base text-textDark"
              icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="ticket" size={28} color="#10b981" /></View>}
              onPress={() => navigation.navigate("UserScheduleList")}
            />
          </View>

          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Bookings" : "Bookings"}
              variant="glass"
              className="flex-col h-32 border-[#f59e0b]/40 bg-[#f59e0b]/10"
              textClassName="mt-3 text-base text-textDark"
              icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="receipt" size={28} color="#f59e0b" /></View>}
              onPress={() => navigation.navigate("BookingsTab")}
            />
          </View>

          {!isAdmin && (
            <View className="w-full mb-4">
              <GlassButton
                title="Help & Support"
                variant="glass"
                className="flex-col h-32 border-[#3b82f6]/40 bg-[#3b82f6]/10"
                textClassName="mt-3 text-lg font-bold text-textDark text-center tracking-widest"
                icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="help-buoy" size={28} color="#3b82f6" /></View>}
                onPress={() => navigation.navigate("UserGuide")}
              />
            </View>
          )}

          {isAdmin && (
            <View className="w-[48%] mb-4">
              <GlassButton
                title="Analytics"
                variant="glass"
                className="flex-col h-32 border-[#3b82f6]/40 bg-[#3b82f6]/10"
                textClassName="mt-3 text-base text-textDark text-center"
                icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="bar-chart" size={28} color="#3b82f6" /></View>}
                onPress={() => navigation.navigate("AdminDashboard")}
              />
            </View>
          )}

          {isAdmin && (
            <View className="w-full mb-4">
              <GlassButton
                title="Admin System Guide"
                variant="glass"
                className="flex-col h-32 border-[#14b8a6]/40 bg-[#14b8a6]/10"
                textClassName="mt-3 text-lg font-bold text-textDark text-center tracking-widest"
                icon={<View className="bg-white/50 p-3 rounded-full border border-white/60"><Ionicons name="book" size={28} color="#14b8a6" /></View>}
                onPress={() => navigation.navigate("AdminGuide")}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center py-6 mt-4 bg-[rgba(255,255,255,0.4)] rounded-2xl border border-[rgba(255,255,255,0.5)]"
          onPress={logout}
        >
          <Ionicons name="power" size={20} color="#e11d48" />
          <Text className="text-red-600 font-bold text-base ml-2">Secure Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </LiquidBackground>
  );
};

export default HomeScreen;