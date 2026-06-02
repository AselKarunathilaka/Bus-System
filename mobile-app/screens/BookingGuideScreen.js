/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import { Ionicons } from "@expo/vector-icons";

const BookingGuideScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
            <Ionicons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-textDark tracking-tight flex-1">How to Book</Text>
        </View>

        <View className="mb-8">
          <Text className="text-base font-sans text-textMuted leading-6">
            Booking a bus ticket on QuickBus is simple, fast, and secure. Follow this comprehensive guide to secure your journey in just a few minutes.
          </Text>
        </View>

        {/* Step 1 */}
        <AppCard className="mb-6 p-6 border-l-4 border-l-blue-500 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Text className="text-blue-600 font-bold text-lg">1</Text>
            </View>
            <Text className="text-xl font-black text-textDark tracking-tight">Find a Trip</Text>
          </View>
          <View className="ml-12">
            <Text className="text-textDark font-medium mb-2 leading-5 text-sm">
              Start your journey right from the Home Screen using the "Find a Trip" search box:
            </Text>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Tap <Text className="font-bold text-slate-700">Leaving from...</Text> and select your starting city from the dropdown.</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Tap <Text className="font-bold text-slate-700">Going to...</Text> and pick your destination.</Text>
            </View>
            <View className="flex-row items-start mb-4">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Select your travel date using the calendar input, then hit <Text className="font-bold text-blue-600">Search Buses</Text>.</Text>
            </View>
            <View className="bg-blue-50 rounded-lg p-3 flex-row items-center">
              <Ionicons name="bulb" size={16} color="#2563EB" className="mr-2" />
              <Text className="text-blue-800 text-xs flex-1"><Text className="font-bold">Pro Tip:</Text> Leave the date blank to see all upcoming schedules for your route!</Text>
            </View>
          </View>
        </AppCard>

        {/* Step 2 */}
        <AppCard className="mb-6 p-6 border-l-4 border-l-indigo-500 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
              <Text className="text-indigo-600 font-bold text-lg">2</Text>
            </View>
            <Text className="text-xl font-black text-textDark tracking-tight">Select Your Schedule</Text>
          </View>
          <View className="ml-12">
            <Text className="text-textDark font-medium mb-2 leading-5 text-sm">
              Browse through the list of available buses matching your criteria:
            </Text>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Review the <Text className="font-bold text-primary">Departure</Text> and <Text className="font-bold text-primary">Arrival</Text> times prominently displayed on each card.</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Check the Ticket Price (in LKR) and the number of available seats remaining.</Text>
            </View>
            <View className="flex-row items-start mb-4">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Tap <Text className="font-bold text-indigo-600">Book Ticket</Text> when you find the perfect match.</Text>
            </View>
            <View className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex-row items-start">
              <Ionicons name="warning" size={16} color="#D97706" className="mr-2 mt-0.5" />
              <Text className="text-amber-800 text-xs flex-1"><Text className="font-bold">Midnight Journeys:</Text> Watch out for the orange warning banner! This appears if a bus departs in the PM and arrives the next day in the AM.</Text>
            </View>
          </View>
        </AppCard>

        {/* Step 3 */}
        <AppCard className="mb-6 p-6 border-l-4 border-l-emerald-500 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
              <Text className="text-emerald-600 font-bold text-lg">3</Text>
            </View>
            <Text className="text-xl font-black text-textDark tracking-tight">Choose Your Seats</Text>
          </View>
          <View className="ml-12">
            <Text className="text-textDark font-medium mb-2 leading-5 text-sm">
              You will be presented with a visual layout of the bus:
            </Text>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Grey seats are already booked. <Text className="font-bold text-blue-600">Blue seats</Text> are available.</Text>
            </View>

            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Tap on any available seat to select it. It will turn <Text className="font-bold text-emerald-600">Green</Text>.</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">You can select multiple seats at once for family and friends. The total price will automatically update at the bottom.</Text>
            </View>
          </View>
        </AppCard>

        {/* Step 4 */}
        <AppCard className="mb-6 p-6 border-l-4 border-l-purple-500 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
              <Text className="text-purple-600 font-bold text-lg">4</Text>
            </View>
            <Text className="text-xl font-black text-textDark tracking-tight">Confirm Booking</Text>
          </View>
          <View className="ml-12">
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Review your final ticket summary, including selected seat numbers and total price.</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Enter your contact phone number in the provided field (mandatory).</Text>
            </View>
            <View className="flex-row items-start mb-4">
              <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 mr-2" />
              <Text className="text-textMuted text-sm flex-1 leading-5">Tap <Text className="font-bold text-purple-600">Confirm Booking</Text>.</Text>
            </View>
            <View className="bg-emerald-50 rounded-lg p-3 flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color="#10B981" className="mr-2" />
              <Text className="text-emerald-800 text-xs flex-1"><Text className="font-bold">Success!</Text> Your digital ticket is generated instantly with a unique QR Code. Find it anytime under the "Tickets" tab.</Text>
            </View>
          </View>
        </AppCard>

        <View className="mt-4 p-6 bg-slate-100 rounded-xl border border-slate-200 items-center">
          <Ionicons name="information-circle-outline" size={32} color="#64748B" className="mb-2" />
          <Text className="text-center text-textDark font-bold mb-1">Need help?</Text>
          <Text className="text-center text-textMuted text-xs">
            You can always reach out to our support team via the Contact Us page.
          </Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default BookingGuideScreen;
