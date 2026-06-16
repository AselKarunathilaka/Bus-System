import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppButton from "../components/ui/AppButton";
import JourneyMapCard from "../components/ui/JourneyMapCard";

const RouteMapOverviewScreen = ({ route, navigation }) => {
  const { routeId, schedule } = route.params;

  const handleBookTicket = () => {
    if (schedule) {
      navigation.navigate("SeatSelection", { schedule });
    }
  };

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 w-full max-w-4xl self-center p-6 pb-0">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Route Journey</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
          <View className="mb-6 flex-1">
            <JourneyMapCard 
              routeId={routeId} 
              schedule={schedule} 
              compact={false} 
              showDetails={true} 
            />
          </View>

          {schedule && (
            <View className="bg-white rounded-3xl p-6 border border-slate-200 mb-6 flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Departure</Text>
                <Text className="text-xl font-black text-primary mb-1">{schedule.departureTime}</Text>
                <Text className="text-sm font-medium text-textDark">{new Date(schedule.departureDate).toLocaleDateString()}</Text>
              </View>
              <View className="items-end">
                <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Arrival</Text>
                <Text className="text-xl font-black text-primary mb-1">{schedule.arrivalTime}</Text>
                <Text className="text-sm font-medium text-textDark">{schedule.routeId?.endLocation}</Text>
              </View>
            </View>
          )}

          {schedule && (
            <AppButton
              title="Book This Trip"
              onPress={handleBookTicket}
              className="mb-8"
            />
          )}
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default RouteMapOverviewScreen;
