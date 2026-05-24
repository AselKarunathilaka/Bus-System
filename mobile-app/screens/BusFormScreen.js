import React, { useContext, useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import { Ionicons } from "@expo/vector-icons";

const BUS_TYPES = ["Normal", "Semi Luxury", "Luxury", "Super Luxury"];
const BUS_STATUS = ["Available", "Maintenance", "Inactive"];

const BusFormScreen = ({ route, navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const editingBus = route.params?.busData;

  const [busName, setBusName] = useState(editingBus?.busName || "");
  const [licenseNumber, setLicenseNumber] = useState(
    editingBus?.licenseNumber || ""
  );
  const [driverName, setDriverName] = useState(editingBus?.driverName || "");
  const [driverNIC, setDriverNIC] = useState(editingBus?.driverNIC || "");
  const [conductorName, setConductorName] = useState(
    editingBus?.conductorName || ""
  );
  const [conductorNIC, setConductorNIC] = useState(
    editingBus?.conductorNIC || ""
  );
  const [busContactNumber, setBusContactNumber] = useState(
    editingBus?.busContactNumber || ""
  );
  const [seatCount, setSeatCount] = useState(
    editingBus?.seatCount !== undefined ? String(editingBus.seatCount) : ""
  );
  const [busType, setBusType] = useState(editingBus?.busType || "Normal");
  const [status, setStatus] = useState(editingBus?.status || "Available");

  const [routes, setRoutes] = useState([]);
  const [assignedRoute, setAssignedRoute] = useState(
    editingBus?.assignedRoute?._id || editingBus?.assignedRoute || ""
  );

  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [saving, setSaving] = useState(false);

  const [openBusType, setOpenBusType] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);

  const sanitizeTextOnly = (text) => text.replace(/[^A-Za-z\s.'-]/g, "");
  const sanitizeLicense = (text) =>
    text.replace(/[^A-Za-z0-9-\s]/g, "").toUpperCase();
  const sanitizeNIC = (text) =>
    text.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const sanitizePhone = (text) => text.replace(/[^0-9+]/g, "");
  const sanitizeNumber = (text) => text.replace(/[^0-9]/g, "");

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);

      const response = await api.get("/routes", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setRoutes(response.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to load routes"
      );
    } finally {
      setLoadingRoutes(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const validateForm = () => {
    if (
      !busName.trim() ||
      !licenseNumber.trim() ||
      !driverName.trim() ||
      !driverNIC.trim() ||
      !conductorName.trim() ||
      !conductorNIC.trim() ||
      !busContactNumber.trim() ||
      !seatCount.trim() ||
      !busType.trim()
    ) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return false;
    }

    if (Number(seatCount) <= 0 || Number(seatCount) > 100) {
      Alert.alert("Validation Error", "Seat count must be between 1 and 100.");
      return false;
    }

    if (busContactNumber.length < 9) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid bus contact number."
      );
      return false;
    }

    if (!BUS_TYPES.includes(busType)) {
      Alert.alert("Validation Error", "Please select a valid bus type.");
      return false;
    }

    if (!BUS_STATUS.includes(status)) {
      Alert.alert("Validation Error", "Please select a valid status.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      busName: busName.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      driverName: driverName.trim(),
      driverNIC: driverNIC.trim().toUpperCase(),
      conductorName: conductorName.trim(),
      conductorNIC: conductorNIC.trim().toUpperCase(),
      busContactNumber: busContactNumber.trim(),
      seatCount: Number(seatCount),
      busType,
      assignedRoute: assignedRoute || null,
      status,
    };

    try {
      setSaving(true);

      if (editingBus) {
        await api.put(`/buses/${editingBus._id}`, payload, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        Alert.alert("Success", "Bus updated successfully.");
      } else {
        await api.post("/buses", payload, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        Alert.alert("Success", "Bus created successfully.");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save bus."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedRouteLabel = () => {
    if (!assignedRoute) return "No route assigned";

    const selected = routes.find((item) => item._id === assignedRoute);

    if (!selected) return "Selected route";

    return `${selected.routeName} (${selected.startLocation} → ${selected.endLocation})`;
  };

  const renderOptionList = (items, selectedValue, onSelect) => (
    <View className="bg-black/5 rounded-xl border border-black/5 mb-4 overflow-hidden">
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          className={`p-4 border-b border-black/5 ${selectedValue === item ? 'bg-blue-50' : ''}`}
          onPress={() => onSelect(item)}
        >
          <Text className="text-slate-900 text-sm font-bold">{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRouteOptions = () => (
    <View className="bg-black/5 rounded-xl border border-black/5 mb-4 overflow-hidden">
      <TouchableOpacity
        className={`p-4 border-b border-black/5 ${!assignedRoute ? 'bg-blue-50' : ''}`}
        onPress={() => {
          setAssignedRoute("");
          setOpenRoute(false);
        }}
      >
        <Text className="text-slate-900 text-sm font-bold">No route assigned</Text>
      </TouchableOpacity>

      {routes.map((item) => (
        <TouchableOpacity
          key={item._id}
          className={`p-4 border-b border-black/5 ${assignedRoute === item._id ? 'bg-blue-50' : ''}`}
          onPress={() => {
            setAssignedRoute(item._id);
            setOpenRoute(false);
          }}
        >
          <Text className="text-slate-900 text-sm font-bold">
            {item.routeName} ({item.startLocation} → {item.endLocation})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
              {editingBus ? "Edit Bus" : "Add Bus"}
            </Text>
          </View>

          <Text className="text-slate-500 text-sm font-semibold mb-6">
            Add bus details, assign a route, and set the bus status separately.
          </Text>

          <GlassCard className="mb-6">
            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Bus Name"
              placeholderTextColor="#94a3b8"
              value={busName}
              onChangeText={setBusName}
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="License Number"
              placeholderTextColor="#94a3b8"
              value={licenseNumber}
              onChangeText={(text) => setLicenseNumber(sanitizeLicense(text))}
              autoCapitalize="characters"
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Driver Name"
              placeholderTextColor="#94a3b8"
              value={driverName}
              onChangeText={(text) => setDriverName(sanitizeTextOnly(text))}
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Driver NIC"
              placeholderTextColor="#94a3b8"
              value={driverNIC}
              onChangeText={(text) => setDriverNIC(sanitizeNIC(text))}
              autoCapitalize="characters"
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Conductor Name"
              placeholderTextColor="#94a3b8"
              value={conductorName}
              onChangeText={(text) => setConductorName(sanitizeTextOnly(text))}
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Conductor NIC"
              placeholderTextColor="#94a3b8"
              value={conductorNIC}
              onChangeText={(text) => setConductorNIC(sanitizeNIC(text))}
              autoCapitalize="characters"
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Bus Contact Number"
              placeholderTextColor="#94a3b8"
              value={busContactNumber}
              onChangeText={(text) => setBusContactNumber(sanitizePhone(text))}
              keyboardType="phone-pad"
            />

            <TextInput
              className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
              placeholder="Seat Count"
              placeholderTextColor="#94a3b8"
              value={seatCount}
              onChangeText={(text) => setSeatCount(sanitizeNumber(text))}
              keyboardType="numeric"
            />

            <Text className="text-slate-900 text-sm font-extrabold mb-2 mt-2 uppercase">Bus Type</Text>
            <TouchableOpacity
              className="bg-white border border-black/10 rounded-xl p-4 mb-4 flex-row justify-between items-center"
              onPress={() => setOpenBusType(!openBusType)}
            >
              <Text className="text-slate-900 text-base font-bold">{busType}</Text>
              <Ionicons name={openBusType ? "chevron-up" : "chevron-down"} size={20} color="#0f172a" />
            </TouchableOpacity>

            {openBusType &&
              renderOptionList(BUS_TYPES, busType, (value) => {
                setBusType(value);
                setOpenBusType(false);
              })}

            <Text className="text-slate-900 text-sm font-extrabold mb-2 mt-2 uppercase">Assign Route</Text>

            {loadingRoutes ? (
              <View className="bg-white rounded-xl p-4 mb-4 items-center border border-black/10">
                <ActivityIndicator color="#0f172a" />
                <Text className="mt-2 text-slate-500 font-bold">Loading routes...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  className="bg-white border border-black/10 rounded-xl p-4 mb-4 flex-row justify-between items-center"
                  onPress={() => setOpenRoute(!openRoute)}
                >
                  <Text className="text-slate-900 text-base font-bold" numberOfLines={1}>{selectedRouteLabel()}</Text>
                  <Ionicons name={openRoute ? "chevron-up" : "chevron-down"} size={20} color="#0f172a" />
                </TouchableOpacity>

                {openRoute && renderRouteOptions()}
              </>
            )}

            <Text className="text-slate-900 text-sm font-extrabold mb-2 mt-2 uppercase">Bus Status</Text>

            <TouchableOpacity
              className="bg-white border border-black/10 rounded-xl p-4 mb-4 flex-row justify-between items-center"
              onPress={() => setOpenStatus(!openStatus)}
            >
              <Text className="text-slate-900 text-base font-bold">{status}</Text>
              <Ionicons name={openStatus ? "chevron-up" : "chevron-down"} size={20} color="#0f172a" />
            </TouchableOpacity>

            {openStatus &&
              renderOptionList(BUS_STATUS, status, (value) => {
                setStatus(value);
                setOpenStatus(false);
              })}
          </GlassCard>

          <View className="mb-10">
            <GlassButton
              title={saving ? "Saving..." : editingBus ? "Update Bus" : "Create Bus"}
              onPress={handleSubmit}
              className={`mb-4 border-[#007AFF]/20 ${saving ? 'opacity-70' : ''}`}
              textClassName="text-white font-extrabold"
              disabled={saving}
            />

            <TouchableOpacity
              className="bg-white border border-slate-300 p-4 rounded-xl items-center"
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text className="text-slate-600 font-bold text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default BusFormScreen;