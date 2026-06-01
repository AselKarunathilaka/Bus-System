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
import AppCard from "../components/ui/AppCard";
import AppBadge from "../components/ui/AppBadge";
import AppButton from "../components/ui/AppButton";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

const BookingItem = ({ item, handleCancel, handleDelete }) => {
  const [showQR, setShowQR] = useState(false);

  const getSeatLabel = (seatNumber) => {
    const row = Math.ceil(seatNumber / 4);
    const colIndex = (seatNumber - 1) % 4;
    const colLetter = ["A", "B", "C", "D"][colIndex];
    return `${row}${colLetter}`;
  };

  const formattedSeats = item.seatNumbers?.map(getSeatLabel).join(", ") || "";

  return (
    <AppCard className="mb-6 p-0 overflow-hidden">
      {/* Header */}
      <View className="bg-slate-50 p-5 border-b border-border flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-extrabold text-textDark tracking-tight">{item.userId?.fullName || "Unknown User"}</Text>
          <Text className="text-xs text-textMuted font-medium uppercase tracking-wider mt-1">
            ID: {item.bookingId || "N/A"}
          </Text>
        </View>
        <AppBadge status={item.status} />
      </View>

      {/* Body */}
      <View className="p-5">
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Route</Text>
            <Text className="text-sm font-bold text-textDark">{item.scheduleId?.routeId?.startLocation} to {item.scheduleId?.routeId?.endLocation}</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Bus</Text>
            <Text className="text-sm font-bold text-textDark">{item.scheduleId?.busId?.licenseNumber}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Date</Text>
            <Text className="text-sm font-bold text-textDark">
              {new Date(item.scheduleId?.departureDate).toLocaleDateString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Seats ({item.bookingType})</Text>
            <Text className="text-sm font-bold text-primary">{formattedSeats}</Text>
          </View>
        </View>

        {item.contactNumber && (
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Contact</Text>
              <Text className="text-sm font-bold text-textDark">{item.contactNumber}</Text>
            </View>
          </View>
        )}

        <View className="flex-row justify-between pt-1">
          <View>
            <Text className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-1">Booked On</Text>
            <Text className="text-sm font-medium text-textMuted">{new Date(item.bookingDate).toLocaleDateString()}</Text>
          </View>
        </View>
        
        {showQR && (
          <View className="mt-6 items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <QRCode value={item.bookingId || item._id} size={120} color="#0F172A" />
            <Text className="text-xs text-textMuted font-bold mt-3 uppercase tracking-widest">Scan Booking QR</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="bg-slate-50 p-5 border-t border-border flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-textMuted font-semibold uppercase tracking-wider mb-1">Total</Text>
          <Text className="text-2xl font-black text-textDark">LKR {item.totalPrice}</Text>
        </View>
        <View className="flex-row">
          <AppButton
            title={showQR ? "Hide QR" : "Show QR"}
            variant="secondary"
            className="px-4 py-2 border border-slate-300 rounded-lg"
            textClassName="text-slate-600 text-xs uppercase font-bold"
            onPress={() => setShowQR(!showQR)}
          />
          {item.status !== "Cancelled" && (
            <AppButton
              title="Cancel"
              variant="ghost"
              className="ml-2 px-4 py-2 border border-amber-500 rounded-lg"
              textClassName="text-amber-600 text-xs uppercase"
              onPress={() => handleCancel(item._id)}
            />
          )}
          <AppButton
            title="Delete"
            variant="danger"
            className="ml-2 px-4 py-2 rounded-lg"
            textClassName="text-xs uppercase"
            onPress={() => handleDelete(item._id)}
          />
        </View>
      </View>
    </AppCard>
  );
};

const AdminBookingListScreen = ({ navigation }) => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      if (Platform.OS === "web") window.alert("Failed to load bookings");
      else Alert.alert("Error", "Failed to load bookings");
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
        if (Platform.OS === "web") window.alert("Booking cancelled successfully.");
        else Alert.alert("Success", "Booking cancelled successfully.");
        
        // Refresh bookings
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: "Cancelled" } : b))
        );
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to cancel booking.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Error", msg);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to cancel this booking?")) executeCancel();
    } else {
      Alert.alert("Cancel", "Are you sure you want to cancel this booking?", [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: executeCancel },
      ]);
    }
  };

  const handleDelete = async (bookingId) => {
    const executeDelete = async () => {
      try {
        await api.delete(`/bookings/admin/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === "web") window.alert("Booking deleted permanently.");
        else Alert.alert("Success", "Booking deleted permanently.");
        
        // Refresh bookings
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } catch (error) {
        const msg = error.response?.data?.message || "Failed to delete booking.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Error", msg);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Permanently delete this booking record?")) executeDelete();
    } else {
      Alert.alert("Delete", "Permanently delete this booking record?", [
        { text: "No", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: executeDelete },
      ]);
    }
  };

  const renderItem = ({ item }) => (
    <BookingItem item={item} handleCancel={handleCancel} handleDelete={handleDelete} />
  );

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 p-6 max-w-4xl w-full self-center">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">All Bookings</Text>
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
          <View className="items-center justify-center mt-20 opacity-80">
            <Ionicons name="folder-open-outline" size={64} color="#94A3B8" />
            <Text className="text-textDark mt-4 font-bold text-lg">No bookings found</Text>
            <Text className="text-textMuted text-sm mt-1 text-center">System booking records will appear here.</Text>
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

export default AdminBookingListScreen;
