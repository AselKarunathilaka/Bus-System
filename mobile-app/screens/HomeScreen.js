import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppLayout from "../components/ui/AppLayout";
import { getGreeting } from "../utils/timeUtils";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="flex-row mr-4 space-x-4">
          <TouchableOpacity onPress={() => navigation.navigate("Routes")}>
            <Ionicons name="map-outline" size={24} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(isAdmin ? "ScheduleList" : "UserScheduleList")}>
            <Ionicons name="calendar-outline" size={24} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Buses")}>
            <Ionicons name="bus-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: { backgroundColor: '#FFFFFF', shadowOpacity: 0, elevation: 0, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
      headerTintColor: '#0F172A',
    });
  }, [navigation, isAdmin]);

  return (
    <AppLayout>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View className="mb-8">
          <Text className="text-3xl font-sans font-extrabold text-textDark tracking-tight">
            {getGreeting(user?.fullName)}
          </Text>
          <Text className="text-base font-sans text-textMuted mt-1">
            Welcome to the QuickBus {isAdmin ? 'Admin Dashboard' : 'Portal'}.
          </Text>
        </View>

        {/* Profile Overview */}
        <AppCard className="mb-8 p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Text className="text-primary font-bold text-lg uppercase">{user?.fullName?.charAt(0) || "U"}</Text>
              </View>
              <View>
                <Text className="text-lg font-sans font-bold text-textDark">{user?.fullName || "N/A"}</Text>
                <Text className="text-sm font-sans text-textMuted">{user?.email || "N/A"}</Text>
              </View>
            </View>
            <View className="bg-success-bg px-3 py-1 rounded-full">
              <Text className="text-success-text text-xs font-bold uppercase tracking-wider">{user?.role || "N/A"}</Text>
            </View>
          </View>
        </AppCard>

        {isAdmin ? (
          <>
            <Text className="text-xl font-sans font-bold text-textDark mb-4 tracking-tight">
              Admin Overview
            </Text>
            <View className="flex-row flex-wrap justify-between">
              
              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("Routes")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center hover:shadow-md">
                  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mb-3">
                    <Ionicons name="map" size={20} color="#2563EB" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Routes</Text>
                </AppCard>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("Buses")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center hover:shadow-md">
                  <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mb-3">
                    <Ionicons name="bus" size={20} color="#4F46E5" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Buses</Text>
                </AppCard>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("ScheduleList")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center hover:shadow-md">
                  <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mb-3">
                    <Ionicons name="calendar" size={20} color="#D97706" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Schedules</Text>
                </AppCard>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("BookingsTab")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center hover:shadow-md">
                  <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mb-3">
                    <Ionicons name="receipt" size={20} color="#059669" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Bookings</Text>
                </AppCard>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("AdminDashboard")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center bg-slate-50 hover:shadow-md">
                  <View className="w-10 h-10 rounded-full bg-slate-200 items-center justify-center mb-3">
                    <Ionicons name="bar-chart" size={20} color="#475569" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Analytics</Text>
                </AppCard>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("UserScheduleList")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center bg-slate-50 hover:shadow-md border-slate-200 border-dashed border-2">
                  <View className="w-10 h-10 rounded-full bg-slate-200 items-center justify-center mb-3">
                    <Ionicons name="add-circle" size={20} color="#64748B" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Book Ticket</Text>
                </AppCard>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] mb-4" onPress={() => navigation.navigate("AdminGuide")} activeOpacity={0.7}>
                <AppCard className="h-32 justify-center items-center bg-slate-50 hover:shadow-md">
                  <View className="w-10 h-10 rounded-full bg-slate-200 items-center justify-center mb-3">
                    <Ionicons name="book" size={20} color="#475569" />
                  </View>
                  <Text className="text-sm font-sans text-textDark font-semibold">Guide</Text>
                </AppCard>
              </TouchableOpacity>

            </View>
          </>
        ) : (
          <>
            <AppCard className="mb-8 border-l-4 border-l-primary p-6">
              <Text className="text-xl font-sans font-extrabold text-textDark mb-6">Find a Trip</Text>
              
              <View className="mb-4 bg-background border border-border rounded-xl px-4 py-3.5 flex-row items-center">
                <Ionicons name="location-outline" size={20} color="#64748B" />
                <Text className="ml-3 font-medium text-textMuted">Leaving from...</Text>
              </View>

              <View className="mb-4 bg-background border border-border rounded-xl px-4 py-3.5 flex-row items-center">
                <Ionicons name="location-outline" size={20} color="#64748B" />
                <Text className="ml-3 font-medium text-textMuted">Going to...</Text>
              </View>
              
              <View className="mb-6 bg-background border border-border rounded-xl px-4 py-3.5 flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#64748B" />
                <Text className="ml-3 font-medium text-textMuted">Date of journey</Text>
              </View>

              <AppButton 
                title="Search Buses"
                icon={<Ionicons name="search" size={20} color="white" />}
                onPress={() => navigation.navigate("UserScheduleList")}
              />
            </AppCard>

            <Text className="text-lg font-sans font-bold text-textDark mb-4 tracking-tight">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between mb-6">
              <TouchableOpacity className="w-[31%] items-center" onPress={() => navigation.navigate("UserScheduleList")} activeOpacity={0.7}>
                <View className="w-14 h-14 rounded-2xl bg-white border border-border items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="ticket" size={24} color="#059669" />
                </View>
                <Text className="text-textDark font-medium text-xs">Book</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-[31%] items-center" onPress={() => navigation.navigate("BookingsTab")} activeOpacity={0.7}>
                <View className="w-14 h-14 rounded-2xl bg-white border border-border items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="receipt" size={24} color="#D97706" />
                </View>
                <Text className="text-textDark font-medium text-xs">Tickets</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-[31%] items-center" onPress={() => navigation.navigate("Routes")} activeOpacity={0.7}>
                <View className="w-14 h-14 rounded-2xl bg-white border border-border items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="map" size={24} color="#2563EB" />
                </View>
                <Text className="text-textDark font-medium text-xs">Routes</Text>
              </TouchableOpacity>
            </View>

            <AppCard className="mb-4 p-5 items-center justify-center bg-slate-50 border-dashed border-2 border-slate-200">
              <Ionicons name="bus-outline" size={32} color="#94A3B8" className="mb-2" />
              <Text className="text-textDark font-bold mb-1">Upcoming Trip</Text>
              <Text className="text-textMuted text-xs text-center">Your upcoming bookings will appear here.</Text>
            </AppCard>
          </>
        )}

        <View className="mt-8 pt-6 border-t border-border">
          <AppButton
            title="Secure Logout"
            variant="ghost"
            onPress={logout}
            icon={<Ionicons name="power" size={20} color="#EF4444" />}
            textClassName="text-danger"
          />
        </View>

      </ScrollView>
    </AppLayout>
  );
};

export default HomeScreen;