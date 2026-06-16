import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
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

const StopFormScreen = ({ route, navigation }) => {
  const { token, user } = useContext(AuthContext);

  const routeId = route.params?.routeId;
  const stopData = route.params?.stopData;

  const [stopName, setStopName] = useState(stopData?.stopName || "");
  const [location, setLocation] = useState(stopData?.location || "");
  const [lat, setLat] = useState(stopData?.coordinates?.lat !== undefined ? String(stopData.coordinates.lat) : "");
  const [lng, setLng] = useState(stopData?.coordinates?.lng !== undefined ? String(stopData.coordinates.lng) : "");
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

  const sanitizeCoordinateField = (text) => {
    return text.replace(/[^0-9.-]/g, "");
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

    if (lat || lng) {
      if (!lat || !lng) {
        Alert.alert("Validation Error", "Both Stop Latitude and Stop Longitude are required if providing coordinates.");
        return false;
      }
      
      const nLat = Number(lat);
      const nLng = Number(lng);
      
      if (isNaN(nLat) || nLat < -90 || nLat > 90) {
        Alert.alert("Validation Error", "Latitude must be between -90 and 90.");
        return false;
      }
      if (isNaN(nLng) || nLng < -180 || nLng > 180) {
        Alert.alert("Validation Error", "Longitude must be between -180 and 180.");
        return false;
      }
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

    if (lat && lng) {
      payload.coordinates = { lat: Number(lat), lng: Number(lng) };
    }

    try {
      setLoading(true);

      if (stopData) {
        await api.put(`/stops/${stopData._id}`, payload);
        Alert.alert("Success", "Stop updated successfully.");
      } else {
        await api.post("/stops", payload);
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
                {stopData ? "Edit Stop" : "Add Stop"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
              <Ionicons name="home-outline" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <AppCard className="mb-6 max-w-2xl w-full self-center">
            <AppInput
              icon="pin-outline"
              placeholder="Stop Name"
              value={stopName}
              onChangeText={(text) => setStopName(sanitizeNameField(text))}
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <AppInput
              icon="map-outline"
              placeholder="Location"
              value={location}
              onChangeText={(text) => setLocation(sanitizeNameField(text))}
              returnKeyType="next"
              containerClassName="mb-4"
            />

            <View className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
              <Text className="text-xs font-bold text-blue-800 mb-3">Google Maps Coordinates (Optional)</Text>
              
              <View className="flex-row gap-4 mb-1">
                <View className="flex-1">
                  <AppInput
                    placeholder="Stop Latitude"
                    value={lat}
                    onChangeText={(text) => setLat(sanitizeCoordinateField(text))}
                    keyboardType="numeric"
                    containerClassName="mb-0"
                  />
                </View>
                <View className="flex-1">
                  <AppInput
                    placeholder="Stop Longitude"
                    value={lng}
                    onChangeText={(text) => setLng(sanitizeCoordinateField(text))}
                    keyboardType="numeric"
                    containerClassName="mb-0"
                  />
                </View>
              </View>
              <Text className="text-[10px] text-blue-600 mt-2">Coordinates are required for Google Map route preview.</Text>
            </View>

            <AppInput
              icon="list-outline"
              placeholder="Order"
              value={order}
              onChangeText={(text) => setOrder(sanitizeNumericField(text))}
              keyboardType="numeric"
              returnKeyType="done"
              containerClassName="mb-2"
            />
          </AppCard>

          <View className="mb-10 max-w-2xl w-full self-center gap-3">
            <AppButton
              title={loading ? (stopData ? "Updating..." : "Creating...") : (stopData ? "Update Stop" : "Create Stop")}
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

export default StopFormScreen;