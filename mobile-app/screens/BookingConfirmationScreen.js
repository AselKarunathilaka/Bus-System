import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Ionicons } from "@expo/vector-icons";

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { schedule, selectedSeats, bookingType } = route.params;
  const { token, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [contactNumber, setContactNumber] = useState(user?.phone || "");
  const [passengerName, setPassengerName] = useState(user?.fullName || "");
  const [adminNote, setAdminNote] = useState("");

  const isAdmin = user?.role === "admin";

  const basePrice = schedule.routeId?.price || 0;
  const totalPrice = basePrice * selectedSeats.length;

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  const formattedSeats = selectedSeats.map(getSeatLabel).join(", ");

  const handleConfirm = async () => {
    if (!isAdmin && (!contactNumber || contactNumber.trim() === "")) {
      Alert.alert("Error", "Contact number is required for your booking.");
      return;
    }
    if (!isAdmin && (!passengerName || passengerName.trim() === "")) {
      Alert.alert("Error", "Passenger name is required for your booking.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        scheduleId: schedule._id,
        seatNumbers: selectedSeats,
        bookingType,
        totalPrice, // Note: Backend recalculates this securely
        contactNumber,
        passengerName,
        passengerPhone: contactNumber,
        adminNote: isAdmin ? adminNote : undefined,
      };

      await api.post("/bookings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Platform.OS === "web") {
        window.alert("Booking confirmed successfully!");
        navigation.navigate("MainTabs", { screen: "BookingsTab" });
      } else {
        Alert.alert("Success", "Booking confirmed successfully!", [
          {
            text: isAdmin ? "View Bookings" : "View My Bookings",
            onPress: () => {
              navigation.navigate("MainTabs", { screen: "BookingsTab" });
            },
          },
        ]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to confirm booking.";
      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Confirm Booking</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="mb-8 relative max-w-md w-full self-center">
            {/* Ticket styling with dashed borders */}
            <View className="bg-white rounded-2xl rounded-b-none border border-slate-200 border-b-0 pb-8 p-6">
              <View className="flex-row items-center mb-6 border-b border-slate-100 pb-4">
                <View className="bg-primary/10 p-3 rounded-full mr-4 border border-primary/20">
                  <Ionicons name="bus" size={20} color="#2563EB" />
                </View>
                <Text className="text-xl font-bold text-textDark tracking-tight">Digital Ticket</Text>
              </View>

              <View className="flex-row justify-between mb-6">
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">From</Text>
                  <Text className="text-base font-bold text-textDark">{schedule.routeId?.startLocation}</Text>
                </View>
                <View className="px-4 justify-center">
                  <Ionicons name="arrow-forward" size={20} color="#94A3B8" />
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">To</Text>
                  <Text className="text-base font-bold text-textDark">{schedule.routeId?.endLocation}</Text>
                </View>
              </View>

              <View className="flex-row justify-between mb-6 border-t border-slate-100 pt-5">
                <View>
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Date</Text>
                  <Text className="text-sm font-bold text-textDark">{new Date(schedule.departureDate).toLocaleDateString()}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Time</Text>
                  <Text className="text-sm font-bold text-textDark">{schedule.departureTime} - {schedule.arrivalTime}</Text>
                </View>
              </View>

              <View className="flex-row justify-between border-t border-slate-100 pt-5">
                <View>
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Bus</Text>
                  <Text className="text-sm font-bold text-textDark">{schedule.busId?.licenseNumber}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Type</Text>
                  <Text className="text-sm font-bold text-textDark">{bookingType}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1.5">Seats ({selectedSeats.length})</Text>
                  <Text className="text-sm font-bold text-primary">{formattedSeats}</Text>
                </View>
              </View>
            </View>

            {/* Ticket Cutouts */}
            <View className="flex-row justify-between items-center absolute left-0 right-0" style={{ bottom: 104, zIndex: 10 }}>
              <View className="w-6 h-6 bg-background rounded-full -ml-3 border-r border-slate-200" />
              <View className="flex-1 border-t-[3px] border-dashed border-slate-200 mx-2" />
              <View className="w-6 h-6 bg-background rounded-full -mr-3 border-l border-slate-200" />
            </View>

            {/* Ticket Bottom - Price */}
            <View className="bg-slate-50 border border-slate-200 border-t-0 rounded-2xl rounded-t-none pt-10 pb-8 px-6">
              <View className="items-center">
                <Text className="text-textMuted font-bold uppercase text-[10px] mb-2 tracking-widest">Total Amount</Text>
                <Text className="text-textDark font-black text-4xl">
                  <Text className="text-xl text-textMuted mr-1">LKR</Text> {totalPrice.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <AppCard className="mb-8 max-w-md w-full self-center">
            <Text className="text-sm font-bold text-textDark mb-6 border-b border-border pb-4">
              {isAdmin ? "Passenger Information (Optional)" : "Passenger Information"}
            </Text>
            
            <AppInput
              icon="person-outline"
              placeholder={isAdmin ? "Customer Name (Optional)" : "Primary Passenger Name *"}
              value={passengerName}
              onChangeText={setPassengerName}
              containerClassName="mb-4"
            />
            
            <AppInput
              icon="call-outline"
              placeholder={isAdmin ? "Customer Phone Number (Optional)" : "Contact Phone Number *"}
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              maxLength={15}
              containerClassName={isAdmin ? "mb-4" : "mb-0"}
            />
            
            {isAdmin && (
              <AppInput
                icon="document-text-outline"
                placeholder="Admin Note (Optional)"
                value={adminNote}
                onChangeText={setAdminNote}
                multiline
                numberOfLines={2}
                containerClassName="mb-0"
              />
            )}
          </AppCard>

          <View className="mb-10 max-w-md w-full self-center">
            <AppButton
              title={loading ? "Confirming..." : "Confirm Booking"}
              onPress={handleConfirm}
              disabled={loading}
              variant="primary"
            />
          </View>
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default BookingConfirmationScreen;
