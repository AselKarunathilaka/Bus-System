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
import GlassInput from "../components/GlassInput";
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
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
                <Ionicons name="arrow-back" size={24} color="#2F80ED" />
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-textDark shadow-sm tracking-tight">
                {stopData ? "Edit Stop" : "Add Stop"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="bg-[rgba(255,255,255,0.4)] p-2 rounded-full border border-[rgba(255,255,255,0.5)]">
              <Ionicons name="home" size={20} color="#2F80ED" />
            </TouchableOpacity>
          </View>

          <GlassCard className="mb-6">
            <GlassInput
              icon="pin"
              placeholder="Stop Name"
              value={stopName}
              onChangeText={(text) => setStopName(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <GlassInput
              icon="map"
              placeholder="Location"
              value={location}
              onChangeText={(text) => setLocation(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <GlassInput
              icon="list"
              placeholder="Order"
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
              className={`mb-4 border-[rgba(255,255,255,0.5)] ${loading ? 'opacity-70' : ''}`}
              textClassName="text-white font-bold"
              disabled={loading}
            />

            <TouchableOpacity
              className="bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.5)] p-4 rounded-xl items-center"
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text className="text-textMuted font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default StopFormScreen;