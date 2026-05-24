import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const StopFormScreen = ({ route, navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const routeId = route.params?.routeId;
  const stopData = route.params?.stopData;

  const [stopName, setStopName] = useState(stopData?.stopName || "");
  const [location, setLocation] = useState(stopData?.location || "");
  const [order, setOrder] = useState(
    stopData?.order !== undefined ? String(stopData.order) : ""
  );
  const [loading, setLoading] = useState(false);

  const sanitizeNameField = (text) => {
    return text.replace(/[^A-Za-z\s.'\-()/]/g, "");
  };

  const sanitizeNumericField = (text) => {
    return text.replace(/[^0-9]/g, "");
  };

  const validateForm = () => {
    if (!stopName.trim() || !location.trim() || !order.trim()) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(stopName.trim())) {
      Alert.alert(
        "Validation Error",
        "Stop name can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(location.trim())) {
      Alert.alert(
        "Validation Error",
        "Location can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^\d+$/.test(order.trim())) {
      Alert.alert("Validation Error", "Stop order must contain numbers only.");
      return false;
    }

    if (Number(order) <= 0) {
      Alert.alert("Validation Error", "Stop order must be greater than 0.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      stopName: stopName.trim(),
      location: location.trim(),
      order: Number(order),
      routeId,
    };

    try {
      setLoading(true);

      if (stopData) {
        await api.put(`/stops/${stopData._id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Stop updated successfully.");
      } else {
        await api.post("/stops", payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Stop created successfully.");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save stop."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiquidBackground>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">
              {stopData ? "Edit Stop" : "Add Stop"}
            </Text>
          </View>

          <GlassCard className="mb-6">
            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Stop Name"
              placeholderTextColor="#94a3b8"
              value={stopName}
              onChangeText={(text) => setStopName(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Location"
              placeholderTextColor="#94a3b8"
              value={location}
              onChangeText={(text) => setLocation(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Order"
              placeholderTextColor="#94a3b8"
              value={order}
              onChangeText={(text) => setOrder(sanitizeNumericField(text))}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </GlassCard>

          <View className="mb-10">
            <GlassButton
              title={loading ? (stopData ? "Updating..." : "Creating...") : (stopData ? "Update Stop" : "Create Stop")}
              onPress={handleSubmit}
              className={`mb-4 border-[#007AFF]/20 ${loading ? 'opacity-70' : ''}`}
              textClassName="text-white font-extrabold"
              disabled={loading}
            />

            <TouchableOpacity
              className="bg-white border border-slate-300 p-4 rounded-xl items-center"
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text className="text-slate-600 font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default StopFormScreen;