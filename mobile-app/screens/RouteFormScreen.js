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

const RouteFormScreen = ({ route, navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const editingRoute = route.params?.routeData;

  const [routeName, setRouteName] = useState(editingRoute?.routeName || "");
  const [startLocation, setStartLocation] = useState(editingRoute?.startLocation || "");
  const [endLocation, setEndLocation] = useState(editingRoute?.endLocation || "");
  const [price, setPrice] = useState(
    editingRoute?.price !== undefined ? String(editingRoute.price) : ""
  );
  const [distanceKm, setDistanceKm] = useState(
    editingRoute?.distanceKm !== undefined ? String(editingRoute.distanceKm) : ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    editingRoute?.estimatedDuration || ""
  );
  const [description, setDescription] = useState(editingRoute?.description || "");
  const [status, setStatus] = useState(editingRoute?.status || "active");
  const [loading, setLoading] = useState(false);

  const sanitizeNameField = (text) => {
    return text.replace(/[^A-Za-z\s.'\-()/]/g, "");
  };

  const sanitizeNumericField = (text) => {
    return text.replace(/[^0-9]/g, "");
  };

  const sanitizeDurationField = (text) => {
    return text.replace(/[^0-9A-Za-z\s]/g, "");
  };

  const validateForm = () => {
    if (
      !routeName.trim() ||
      !startLocation.trim() ||
      !endLocation.trim() ||
      !price.trim() ||
      !distanceKm.trim() ||
      !estimatedDuration.trim()
    ) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(routeName.trim())) {
      Alert.alert(
        "Validation Error",
        "Route name can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(startLocation.trim())) {
      Alert.alert(
        "Validation Error",
        "Start location can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(endLocation.trim())) {
      Alert.alert(
        "Validation Error",
        "End location can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^\d+$/.test(price.trim())) {
      Alert.alert("Validation Error", "Price must contain numbers only.");
      return false;
    }

    if (!/^\d+$/.test(distanceKm.trim())) {
      Alert.alert("Validation Error", "Distance must contain numbers only.");
      return false;
    }

    if (Number(price) <= 0) {
      Alert.alert("Validation Error", "Price must be greater than 0.");
      return false;
    }

    if (Number(distanceKm) <= 0) {
      Alert.alert("Validation Error", "Distance must be greater than 0.");
      return false;
    }

    if (!/^[0-9A-Za-z\s]+$/.test(estimatedDuration.trim())) {
      Alert.alert(
        "Validation Error",
        "Estimated duration should only contain letters, numbers, and spaces."
      );
      return false;
    }

    if (!["active", "inactive"].includes(status.toLowerCase().trim())) {
      Alert.alert("Validation Error", "Status must be active or inactive.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      routeName: routeName.trim(),
      startLocation: startLocation.trim(),
      endLocation: endLocation.trim(),
      price: Number(price),
      distanceKm: Number(distanceKm),
      estimatedDuration: estimatedDuration.trim(),
      description: description.trim(),
      status: status.toLowerCase().trim(),
    };

    try {
      setLoading(true);

      if (editingRoute) {
        await api.put(`/routes/${editingRoute._id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Route updated successfully.");
      } else {
        await api.post("/routes", payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Route created successfully.");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save route."
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
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white shadow-sm flex-1 tracking-tight">
              {editingRoute ? "Edit Route" : "Add Route"}
            </Text>
          </View>

          <GlassCard className="mb-6">
            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Route Name"
              placeholderTextColor="#94a3b8"
              value={routeName}
              onChangeText={(text) => setRouteName(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Start Location"
              placeholderTextColor="#94a3b8"
              value={startLocation}
              onChangeText={(text) => setStartLocation(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="End Location"
              placeholderTextColor="#94a3b8"
              value={endLocation}
              onChangeText={(text) => setEndLocation(sanitizeNameField(text))}
              returnKeyType="next"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Price (LKR)"
              placeholderTextColor="#94a3b8"
              value={price}
              onChangeText={(text) => setPrice(sanitizeNumericField(text))}
              keyboardType="numeric"
              returnKeyType="next"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Distance in KM"
              placeholderTextColor="#94a3b8"
              value={distanceKm}
              onChangeText={(text) => setDistanceKm(sanitizeNumericField(text))}
              keyboardType="numeric"
              returnKeyType="next"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Estimated Duration (e.g. 3h 30m)"
              placeholderTextColor="#94a3b8"
              value={estimatedDuration}
              onChangeText={(text) => setEstimatedDuration(sanitizeDurationField(text))}
              returnKeyType="next"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base min-h-[100px]"
              placeholder="Description"
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <TextInput
              className="bg-white/10 border border-white/10 text-white p-4 rounded-xl mb-4 font-semibold text-base"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Status (active/inactive)"
              placeholderTextColor="#94a3b8"
              value={status}
              onChangeText={setStatus}
              autoCapitalize="none"
              returnKeyType="done"
            />
          </GlassCard>

          <View className="mb-10">
            <GlassButton
              title={loading ? (editingRoute ? "Updating..." : "Creating...") : (editingRoute ? "Update Route" : "Create Route")}
              onPress={handleSubmit}
              className={`mb-4 border-white/10 ${loading ? 'opacity-70' : ''}`}
              textClassName="text-white font-bold"
              disabled={loading}
            />

            <TouchableOpacity
              className="bg-white/5 border border-white/10 p-4 rounded-xl items-center"
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text className="text-slate-400 font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default RouteFormScreen;