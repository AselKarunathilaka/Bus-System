import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import SkeuCard from "../components/SkeuCard";
import SkeuButton from "../components/SkeuButton";

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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 20 }}>
      
      {/* Hero Banner (Debossed style) */}
      <View className="bg-[#a3b1c6] rounded-3xl p-6 mb-6 shadow-neo-inner">
        <View className="bg-brand self-start px-3 py-1.5 rounded-full mb-3 shadow-neo-light">
          <Text className="text-white text-xs font-bold">QuickBus Portal</Text>
        </View>
        <Text className="text-2xl font-black text-slate-800 mb-2">
          Welcome Back, {user?.fullName?.split(" ")[0] || "User"}
        </Text>
        <Text className="text-sm text-slate-600 font-medium leading-relaxed">
          The all-new physical interface. Feel the buttons as you navigate through your highway bookings.
        </Text>
      </View>

      {/* Profile Overview (Embossed SkeuCard) */}
      <SkeuCard className="mb-6">
        <Text className="text-lg font-black text-slate-700 mb-4 tracking-tight">
          System Access
        </Text>
        <View className="flex-row items-center mb-3">
          <View className="bg-background shadow-neo-inner w-10 h-10 rounded-full items-center justify-center mr-4">
            <Ionicons name="person" size={18} color="#64748b" />
          </View>
          <View>
            <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">Name</Text>
            <Text className="text-base text-slate-800 font-extrabold">{user?.fullName || "N/A"}</Text>
          </View>
        </View>
        <View className="flex-row items-center mb-3">
          <View className="bg-background shadow-neo-inner w-10 h-10 rounded-full items-center justify-center mr-4">
            <Ionicons name="mail" size={18} color="#64748b" />
          </View>
          <View>
            <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">Email</Text>
            <Text className="text-base text-slate-800 font-extrabold">{user?.email || "N/A"}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <View className="bg-background shadow-neo-inner w-10 h-10 rounded-full items-center justify-center mr-4">
            <Ionicons name="shield-checkmark" size={18} color="#64748b" />
          </View>
          <View>
            <Text className="text-xs text-slate-500 font-bold uppercase tracking-widest">Role</Text>
            <Text className="text-base text-slate-800 font-extrabold">{user?.role || "N/A"}</Text>
          </View>
        </View>
      </SkeuCard>

      <Text className="text-xl font-black text-slate-700 mb-4 tracking-tight">
        Control Panel
      </Text>

      {/* Grid Menu using SkeuButtons */}
      <View className="flex-row flex-wrap justify-between">
        
        <View className="w-[48%] mb-4">
          <SkeuButton
            title={isAdmin ? "Routes" : "Routes"}
            className="flex-col h-32"
            textClassName="mt-3 text-base"
            icon={<View className="bg-[#e0f2fe] p-3 rounded-full shadow-neo-inner"><Ionicons name="map" size={28} color="#0284c7" /></View>}
            onPress={() => navigation.navigate("Routes")}
          />
        </View>

        <View className="w-[48%] mb-4">
          <SkeuButton
            title={isAdmin ? "Buses" : "Buses"}
            className="flex-col h-32"
            textClassName="mt-3 text-base"
            icon={<View className="bg-[#f3e8ff] p-3 rounded-full shadow-neo-inner"><Ionicons name="bus" size={28} color="#9333ea" /></View>}
            onPress={() => navigation.navigate("Buses")}
          />
        </View>

        {isAdmin && (
          <View className="w-[48%] mb-4">
            <SkeuButton
              title="Schedules"
              className="flex-col h-32"
              textClassName="mt-3 text-base"
              icon={<View className="bg-[#ffedd5] p-3 rounded-full shadow-neo-inner"><Ionicons name="calendar" size={28} color="#ea580c" /></View>}
              onPress={() => navigation.navigate("ScheduleList")}
            />
          </View>
        )}

        <View className="w-[48%] mb-4">
          <SkeuButton
            title="Book Ticket"
            className="flex-col h-32"
            textClassName="mt-3 text-base"
            icon={<View className="bg-[#dcfce7] p-3 rounded-full shadow-neo-inner"><Ionicons name="ticket" size={28} color="#16a34a" /></View>}
            onPress={() => navigation.navigate("UserScheduleList")}
          />
        </View>

        <View className="w-[48%] mb-4">
          <SkeuButton
            title={isAdmin ? "Bookings" : "Bookings"}
            className="flex-col h-32"
            textClassName="mt-3 text-base"
            icon={<View className="bg-[#fce7f3] p-3 rounded-full shadow-neo-inner"><Ionicons name="receipt" size={28} color="#db2777" /></View>}
            onPress={() => navigation.navigate("BookingsTab")}
          />
        </View>

        {isAdmin && (
          <View className="w-[48%] mb-4">
            <SkeuButton
              title="Analytics"
              className="flex-col h-32"
              textClassName="mt-3 text-base text-center"
              icon={<View className="bg-[#e0e7ff] p-3 rounded-full shadow-neo-inner"><Ionicons name="bar-chart" size={28} color="#4f46e5" /></View>}
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
        <Text className="text-red-500 font-bold text-base ml-2">Hardware Shutdown</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default HomeScreen;