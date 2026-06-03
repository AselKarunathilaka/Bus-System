import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import { Ionicons } from "@expo/vector-icons";

const BUS_TYPES = ["Normal", "Semi Luxury", "Luxury", "Super Luxury"];
const BUS_STATUS = ["Available", "Maintenance", "Inactive"];

const BusFormScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);

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

      const response = await api.get("/routes");

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
        await api.put(`/buses/${editingBus._id}`, payload);

        Alert.alert("Success", "Bus updated successfully.");
      } else {
        await api.post("/buses", payload);

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
    <View className="bg-white rounded-xl border border-border mb-4 overflow-hidden">
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          className={`p-4 border-b border-slate-100`}
          style={selectedValue === item ? { backgroundColor: "rgba(37,99,235,0.05)" } : undefined}
          onPress={() => onSelect(item)}
        >
          <Text className="text-textDark text-sm font-bold">{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRouteOptions = () => (
    <View className="bg-white rounded-xl border border-border mb-4 overflow-hidden">
      <TouchableOpacity
        className="p-4 border-b border-slate-100"
        style={!assignedRoute ? { backgroundColor: "rgba(37,99,235,0.05)" } : undefined}
        onPress={() => {
          setAssignedRoute("");
          setOpenRoute(false);
        }}
      >
        <Text className="text-textDark text-sm font-bold">No route assigned</Text>
      </TouchableOpacity>

      {routes.map((item) => (
        <TouchableOpacity
          key={item._id}
          className="p-4 border-b border-slate-100"
          style={assignedRoute === item._id ? { backgroundColor: "rgba(37,99,235,0.05)" } : undefined}
          onPress={() => {
            setAssignedRoute(item._id);
            setOpenRoute(false);
          }}
        >
          <Text className="text-textDark text-sm font-bold">
            {item.routeName} ({item.startLocation} → {item.endLocation})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
                {editingBus ? "Edit Bus" : "Add Bus"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} className="p-2">
              <Ionicons name="home-outline" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View className="max-w-2xl w-full self-center">
            <Text className="text-textMuted text-sm font-semibold mb-6">
              Add bus details, assign a route, and set the bus status separately.
            </Text>

            <AppCard className="mb-6">
              <AppInput
                icon="bus-outline"
                placeholder="Bus Name"
                value={busName}
                onChangeText={setBusName}
                containerClassName="mb-4"
              />

              <AppInput
                icon="card-outline"
                placeholder="License Number"
                value={licenseNumber}
                onChangeText={(text) => setLicenseNumber(sanitizeLicense(text))}
                autoCapitalize="characters"
                containerClassName="mb-4"
              />

              <AppInput
                icon="person-outline"
                placeholder="Driver Name"
                value={driverName}
                onChangeText={(text) => setDriverName(sanitizeTextOnly(text))}
                containerClassName="mb-4"
              />

              <AppInput
                icon="id-card-outline"
                placeholder="Driver NIC"
                value={driverNIC}
                onChangeText={(text) => setDriverNIC(sanitizeNIC(text))}
                autoCapitalize="characters"
                containerClassName="mb-4"
              />

              <AppInput
                icon="person-add-outline"
                placeholder="Conductor Name"
                value={conductorName}
                onChangeText={(text) => setConductorName(sanitizeTextOnly(text))}
                containerClassName="mb-4"
              />

              <AppInput
                icon="id-card-outline"
                placeholder="Conductor NIC"
                value={conductorNIC}
                onChangeText={(text) => setConductorNIC(sanitizeNIC(text))}
                autoCapitalize="characters"
                containerClassName="mb-4"
              />

              <AppInput
                icon="call-outline"
                placeholder="Bus Contact Number"
                value={busContactNumber}
                onChangeText={(text) => setBusContactNumber(sanitizePhone(text))}
                keyboardType="phone-pad"
                containerClassName="mb-4"
              />

              <AppInput
                icon="people-outline"
                placeholder="Seat Count"
                value={seatCount}
                onChangeText={(text) => setSeatCount(sanitizeNumber(text))}
                keyboardType="numeric"
                containerClassName="mb-4"
              />

              <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2 mt-4 ml-1">Bus Type</Text>
              <TouchableOpacity
                className="bg-background border border-border rounded-xl p-4 mb-4 flex-row justify-between items-center"
                onPress={() => setOpenBusType(!openBusType)}
              >
                <Text className="text-textDark text-base font-bold">{busType}</Text>
                <Ionicons name={openBusType ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
              </TouchableOpacity>

              {openBusType &&
                renderOptionList(BUS_TYPES, busType, (value) => {
                  setBusType(value);
                  setOpenBusType(false);
                })}

              <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2 mt-4 ml-1">Assign Route</Text>

              {loadingRoutes ? (
                <View className="bg-slate-50 rounded-xl p-4 mb-4 items-center border border-border">
                  <ActivityIndicator color="#2563EB" />
                  <Text className="mt-2 text-textMuted font-bold">Loading routes...</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    className="bg-background border border-border rounded-xl p-4 mb-4 flex-row justify-between items-center"
                    onPress={() => setOpenRoute(!openRoute)}
                  >
                    <Text className="text-textDark text-base font-bold" numberOfLines={1}>{selectedRouteLabel()}</Text>
                    <Ionicons name={openRoute ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
                  </TouchableOpacity>

                  {openRoute && renderRouteOptions()}
                </>
              )}

              <Text className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-2 mt-4 ml-1">Bus Status</Text>

              <TouchableOpacity
                className="bg-background border border-border rounded-xl p-4 mb-2 flex-row justify-between items-center"
                onPress={() => setOpenStatus(!openStatus)}
              >
                <Text className="text-textDark text-base font-bold">{status}</Text>
                <Ionicons name={openStatus ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
              </TouchableOpacity>

              {openStatus &&
                renderOptionList(BUS_STATUS, status, (value) => {
                  setStatus(value);
                  setOpenStatus(false);
                })}
            </AppCard>

            <View className="mb-10 gap-3">
              <AppButton
                title={saving ? "Saving..." : editingBus ? "Update Bus" : "Create Bus"}
                onPress={handleSubmit}
                disabled={saving}
                variant="primary"
              />

              <AppButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                disabled={saving}
                variant="secondary"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
};

export default BusFormScreen;