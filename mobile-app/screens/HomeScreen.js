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
          <View className="bg-black/5 self-start px-3 py-1.5 rounded-full mb-3 border border-black/5">
            <Text className="text-slate-900 text-xs font-bold">QuickBus Portal</Text>
          </View>
          <Text className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Welcome Back, {user?.fullName?.split(" ")[0] || "User"}
          </Text>
          <Text className="text-sm text-slate-600 font-medium leading-relaxed">
            The all-new minimalist interface. Clean, bright, and stunningly modern.
          </Text>
        </GlassCard>

        {/* Profile Overview (GlassCard) */}
        <GlassCard className="mb-6">
          <Text className="text-lg font-black text-slate-900 mb-4 tracking-tight">
            System Access
          </Text>
          <View className="flex-row items-center mb-3">
            <View className="bg-black/5 w-10 h-10 rounded-full items-center justify-center mr-4">
              <Ionicons name="person" size={18} color="#475569" />
            </View>
            <View>
              <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">Name</Text>
              <Text className="text-base text-slate-900 font-extrabold">{user?.fullName || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-3">
            <View className="bg-black/5 w-10 h-10 rounded-full items-center justify-center mr-4">
              <Ionicons name="mail" size={18} color="#475569" />
            </View>
            <View>
              <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email</Text>
              <Text className="text-base text-slate-900 font-extrabold">{user?.email || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="bg-black/5 w-10 h-10 rounded-full items-center justify-center mr-4">
              <Ionicons name="shield-checkmark" size={18} color="#475569" />
            </View>
            <View>
              <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">Role</Text>
              <Text className="text-base text-slate-900 font-extrabold">{user?.role || "N/A"}</Text>
            </View>
          </View>
        </GlassCard>

        <Text className="text-xl font-black text-slate-900 mb-4 tracking-tight shadow-sm">
          Control Panel
        </Text>

        {/* Grid Menu using GlassButtons */}
        <View className="flex-row flex-wrap justify-between">
          
          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Routes" : "Routes"}
              className="flex-col h-32"
              textClassName="mt-3 text-base text-white"
              icon={<View className="bg-white/20 p-3 rounded-full border border-white/30"><Ionicons name="map" size={28} color="#ffffff" /></View>}
              onPress={() => navigation.navigate("Routes")}
            />
          </View>

          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Buses" : "Buses"}
              className="flex-col h-32"
              textClassName="mt-3 text-base text-white"
              icon={<View className="bg-white/20 p-3 rounded-full border border-white/30"><Ionicons name="bus" size={28} color="#ffffff" /></View>}
              onPress={() => navigation.navigate("Buses")}
            />
          </View>

          {isAdmin && (
            <View className="w-[48%] mb-4">
              <GlassButton
                title="Schedules"
                className="flex-col h-32"
                textClassName="mt-3 text-base text-white"
                icon={<View className="bg-white/20 p-3 rounded-full border border-white/30"><Ionicons name="calendar" size={28} color="#ffffff" /></View>}
                onPress={() => navigation.navigate("ScheduleList")}
              />
            </View>
          )}

          <View className="w-[48%] mb-4">
            <GlassButton
              title="Book Ticket"
              className="flex-col h-32"
              textClassName="mt-3 text-base text-white"
              icon={<View className="bg-white/20 p-3 rounded-full border border-white/30"><Ionicons name="ticket" size={28} color="#ffffff" /></View>}
              onPress={() => navigation.navigate("UserScheduleList")}
            />
          </View>

          <View className="w-[48%] mb-4">
            <GlassButton
              title={isAdmin ? "Bookings" : "Bookings"}
              className="flex-col h-32"
              textClassName="mt-3 text-base text-white"
              icon={<View className="bg-white/20 p-3 rounded-full border border-white/30"><Ionicons name="receipt" size={28} color="#ffffff" /></View>}
              onPress={() => navigation.navigate("BookingsTab")}
            />
          </View>

          {isAdmin && (
            <View className="w-[48%] mb-4">
              <GlassButton
                title="Analytics"
                className="flex-col h-32"
                textClassName="mt-3 text-base text-center text-white"
                icon={<View className="bg-white/20 p-3 rounded-full border border-white/30"><Ionicons name="bar-chart" size={28} color="#ffffff" /></View>}
                onPress={() => navigation.navigate("AdminDashboard")}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          className="flex-row items-center justify-center py-6 mt-4"
          onPress={logout}
        >
          <Ionicons name="power" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold text-base ml-2">Secure Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </LiquidBackground>
  );
};

export default HomeScreen;