import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Ionicons } from "@expo/vector-icons";

const RouteFormScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);

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
        await api.put(`/routes/${editingRoute._id}`, payload);
        Alert.alert("Success", "Route updated successfully.");
      } else {
        await api.post("/routes", payload);
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
    <AppLayout useSafeArea>
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
          <View className="flex-row items-center justify-between mb-8 max-w-2xl w-full self-center">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
                <Ionicons name="arrow-back" size={24} color="#64748B" />
              </TouchableOpacity>
              <Text className="text-2xl font-extrabold text-textDark tracking-tight">
                {editingRoute ? "Edit Route" : "Add Route"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
              <Ionicons name="home-outline" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <AppCard className="mb-6 max-w-2xl w-full self-center">
            <AppInput
              icon="map-outline"
              placeholder="Route Name"
              value={routeName}
              onChangeText={(text) => setRouteName(sanitizeNameField(text))}
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <AppInput
              icon="navigate-circle-outline"
              placeholder="Start Location"
              value={startLocation}
              onChangeText={(text) => setStartLocation(sanitizeNameField(text))}
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <AppInput
              icon="location-outline"
              placeholder="End Location"
              value={endLocation}
              onChangeText={(text) => setEndLocation(sanitizeNameField(text))}
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <AppInput
              icon="cash-outline"
              placeholder="Price (LKR)"
              value={price}
              onChangeText={(text) => setPrice(sanitizeNumericField(text))}
              keyboardType="numeric"
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <AppInput
              icon="speedometer-outline"
              placeholder="Distance in KM"
              value={distanceKm}
              onChangeText={(text) => setDistanceKm(sanitizeNumericField(text))}
              keyboardType="numeric"
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <AppInput
              icon="time-outline"
              placeholder="Estimated Duration (e.g. 3h 30m)"
              value={estimatedDuration}
              onChangeText={(text) => setEstimatedDuration(sanitizeDurationField(text))}
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <TextInput
              className="bg-background border border-border text-textDark p-4 rounded-xl mb-4 font-medium text-base min-h-[100px]"
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
              placeholder="Description"
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <AppInput
              icon="toggle-outline"
              placeholder="Status (active/inactive)"
              value={status}
              onChangeText={setStatus}
              autoCapitalize="none"
              returnKeyType="done"
              containerClassName="mb-2"
            />
          </AppCard>

          <View className="mb-10 max-w-2xl w-full self-center gap-3">
            <AppButton
              title={loading ? (editingRoute ? "Updating..." : "Creating...") : (editingRoute ? "Update Route" : "Create Route")}
              onPress={handleSubmit}
              disabled={loading}
              variant="primary"
            />

            <AppButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              disabled={loading}
              variant="secondary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

export default RouteFormScreen;