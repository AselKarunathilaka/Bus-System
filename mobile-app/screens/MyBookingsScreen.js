import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../components/ui/AppLayout";
import AppBadge from "../components/ui/AppBadge";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

const MyBookingsScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBookings();
    });
    return unsubscribe;
  }, [token, navigation]);

  const handleCancel = async (bookingId) => {
    const executeCancel = async () => {
      try {
        await api.delete(`/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS !== "web") {
          Alert.alert("Success", "Booking cancelled successfully.");
        } else {
          window.alert("Booking cancelled successfully.");
        }
        fetchBookings();
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to cancel booking.";
        if (Platform.OS !== "web") {
          Alert.alert("Error", msg);
        } else {
          window.alert(msg);
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to cancel this booking?");
      if (confirmed) {
        executeCancel();
      }
    } else {
      Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: executeCancel,
        },
      ]);
    }
  };

  const handleContinuePayment = async (bookingId) => {
    try {
      const paymentResponse = await api.post(`/payments/initiate/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.navigate("PaymentScreen", {
        paymentDetails: paymentResponse.data,
      });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to initiate payment");
    }
  };

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  const renderItem = ({ item }) => {
    const formattedSeats = item.seatNumbers.map(getSeatLabel).join(", ");
    
    return (
      <View className="mb-6 self-center w-full max-w-md">
        {/* Ticket Header */}
        <View className="p-5 border-b-0 rounded-t-3xl relative overflow-hidden" style={{ backgroundColor: "rgba(37,99,235,0.05)", borderWidth: 1, borderColor: "rgba(37,99,235,0.2)" }}>
          <View className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-10" style={{ backgroundColor: "rgba(37,99,235,0.1)" }} />
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-textDark flex-1 pr-3 tracking-tight leading-7">
              {item.scheduleId?.routeId?.startLocation} <Text className="text-primary font-black px-2">→</Text> {item.scheduleId?.routeId?.endLocation}
            </Text>
            <AppBadge status={item.status} />
          </View>
          <View className="self-start px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.6)", borderWidth: 1, borderColor: "rgba(37,99,235,0.1)" }}>
            <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest">
              Booking ID: <Text className="text-textDark">{item.bookingId || "N/A"}</Text>
            </Text>
          </View>
        </View>

        {/* Ticket Body (Dashed border simulation) */}
        <View className="bg-white p-5 border-l border-r border-slate-200 border-dashed border-t-2 relative">
          <View className="flex-row justify-between items-center absolute left-0 right-0 -top-[13px] z-10 px-0">
            <View className="w-6 h-6 bg-background rounded-full -ml-3 border-r border-slate-200" />
            <View className="w-6 h-6 bg-background rounded-full -mr-3 border-l border-slate-200" />
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <View className="flex-row justify-between mb-5">
                <View>
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Bus</Text>
                  <Text className="text-sm font-bold text-textDark">{item.scheduleId?.busId?.licenseNumber || "N/A"}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Seats</Text>
                  <Text className="text-sm font-bold text-primary">{formattedSeats}</Text>
                </View>
              </View>

              <View className="mb-5">
                <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Date & Time</Text>
                <Text className="text-sm font-bold text-textDark">
                  {new Date(item.scheduleId?.departureDate).toLocaleDateString()} at {item.scheduleId?.departureTime}
                </Text>
              </View>
              
              {item.contactNumber && (
                <View>
                  <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1">Contact</Text>
                  <Text className="text-sm font-bold text-textDark">{item.contactNumber}</Text>
                </View>
              )}
            </View>

            <View className="justify-center items-center p-3 bg-white rounded-xl border border-slate-100 min-w-[100px]">
              {(item.status === "Confirmed" && (item.paymentStatus === "Paid" || item.paymentStatus === "NotRequired")) ? (
                <>
                  <QRCode 
                    value={item.bookingId || item._id} 
                    size={80} 
                    color="#0F172A" 
                    backgroundColor="transparent"
                  />
                  <Text className="text-[8px] text-textMuted font-bold mt-2 uppercase tracking-widest">Scan Ticket</Text>
                </>
              ) : (
                <View className="items-center justify-center h-[100px]">
                  <Ionicons name="lock-closed-outline" size={32} color="#94A3B8" />
                  <Text className="text-[10px] text-textMuted font-bold mt-2 uppercase tracking-widest text-center">Ticket{'\n'}Unavailable</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Ticket Footer (Total Price) */}
        <View className="bg-slate-50 p-5 border border-slate-200 border-t-2 rounded-b-3xl border-dashed relative">
          <View className="flex-row justify-between items-center absolute left-0 right-0 -top-[13px] z-10 px-0">
            <View className="w-6 h-6 bg-background rounded-full -ml-3 border-r border-slate-200" />
            <View className="w-6 h-6 bg-background rounded-full -mr-3 border-l border-slate-200" />
          </View>
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-[10px] text-textMuted font-bold uppercase tracking-widest mb-1.5">Total Amount</Text>
              <Text className="text-2xl font-black text-textDark tracking-tight">
                <Text className="text-sm text-textMuted mr-1">LKR</Text> {item.totalPrice}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              {item.status === "Confirmed" && item.scheduleId?.routeId?._id && (
                <TouchableOpacity
                  className="bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-200 active:bg-blue-100 mr-2"
                  onPress={() => navigation.navigate("RouteMapOverview", { 
                    routeId: item.scheduleId.routeId._id,
                    schedule: item.scheduleId
                  })}
                >
                  <Text className="text-blue-600 font-bold text-xs uppercase tracking-wider">Map</Text>
                </TouchableOpacity>
              )}
              
              {item.status === "PendingPayment" && item.paymentStatus === "Pending" && (
                <TouchableOpacity
                  className="bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 active:bg-emerald-100 mr-2"
                  onPress={() => handleContinuePayment(item._id)}
                >
                  <Text className="text-emerald-700 font-bold text-xs uppercase tracking-wider">Pay Now</Text>
                </TouchableOpacity>
              )}

              {item.status !== "Cancelled" && item.status !== "PaymentFailed" && item.status !== "Expired" && (
                <TouchableOpacity
                  className="bg-red-50 px-4 py-2.5 rounded-xl border border-red-200 active:bg-red-100"
                  onPress={() => handleCancel(item._id)}
                >
                  <Text className="text-red-600 font-bold text-xs uppercase tracking-wider">Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">My Bookings</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-textMuted font-medium">Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="items-center justify-center mt-20" style={{ opacity: 0.8 }}>
            <Ionicons name="ticket-outline" size={64} color="#94A3B8" />
            <Text className="text-textDark mt-4 font-bold text-lg">No bookings yet</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">Your digital tickets will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </AppLayout>
  );
};

export default MyBookingsScreen;
