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
    <View style={styles.optionList}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.optionItem,
            selectedValue === item && styles.selectedOption,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRouteOptions = () => (
    <View style={styles.optionList}>
      <TouchableOpacity
        style={[styles.optionItem, !assignedRoute && styles.selectedOption]}
        onPress={() => {
          setAssignedRoute("");
          setOpenRoute(false);
        }}
      >
        <Text style={styles.optionText}>No route assigned</Text>
      </TouchableOpacity>

      {routes.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={[
            styles.optionItem,
            assignedRoute === item._id && styles.selectedOption,
          ]}
          onPress={() => {
            setAssignedRoute(item._id);
            setOpenRoute(false);
          }}
        >
          <Text style={styles.optionText}>
            {item.routeName} ({item.startLocation} → {item.endLocation})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{editingBus ? "Edit Bus" : "Add Bus"}</Text>

        <Text style={styles.subtitle}>
          Add bus details, assign a route, and set the bus status separately.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Bus Name"
          value={busName}
          onChangeText={setBusName}
        />

        <TextInput
          style={styles.input}
          placeholder="License Number"
          value={licenseNumber}
          onChangeText={(text) => setLicenseNumber(sanitizeLicense(text))}
          autoCapitalize="characters"
        />

        <TextInput
          style={styles.input}
          placeholder="Driver Name"
          value={driverName}
          onChangeText={(text) => setDriverName(sanitizeTextOnly(text))}
        />

        <TextInput
          style={styles.input}
          placeholder="Driver NIC"
          value={driverNIC}
          onChangeText={(text) => setDriverNIC(sanitizeNIC(text))}
          autoCapitalize="characters"
        />

        <TextInput
          style={styles.input}
          placeholder="Conductor Name"
          value={conductorName}
          onChangeText={(text) => setConductorName(sanitizeTextOnly(text))}
        />

        <TextInput
          style={styles.input}
          placeholder="Conductor NIC"
          value={conductorNIC}
          onChangeText={(text) => setConductorNIC(sanitizeNIC(text))}
          autoCapitalize="characters"
        />

        <TextInput
          style={styles.input}
          placeholder="Bus Contact Number"
          value={busContactNumber}
          onChangeText={(text) => setBusContactNumber(sanitizePhone(text))}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Seat Count"
          value={seatCount}
          onChangeText={(text) => setSeatCount(sanitizeNumber(text))}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Bus Type</Text>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setOpenBusType(!openBusType)}
        >
          <Text style={styles.selectText}>{busType}</Text>
        </TouchableOpacity>

        {openBusType &&
          renderOptionList(BUS_TYPES, busType, (value) => {
            setBusType(value);
            setOpenBusType(false);
          })}

        <Text style={styles.label}>Assign Route</Text>

        {loadingRoutes ? (
          <View style={styles.loadingRoutes}>
            <ActivityIndicator />
            <Text style={styles.loadingRoutesText}>Loading routes...</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setOpenRoute(!openRoute)}
            >
              <Text style={styles.selectText}>{selectedRouteLabel()}</Text>
            </TouchableOpacity>

            {openRoute && renderRouteOptions()}
          </>
        )}

        <Text style={styles.label}>Bus Status</Text>

        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setOpenStatus(!openStatus)}
        >
          <Text style={styles.selectText}>{status}</Text>
        </TouchableOpacity>

        {openStatus &&
          renderOptionList(BUS_STATUS, status, (value) => {
            setStatus(value);
            setOpenStatus(false);
          })}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Saving..." : editingBus ? "Update Bus" : "Create Bus"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BusFormScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },

  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#eef4ff",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 18,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  label: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 4,
  },

  selectButton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginBottom: 12,
  },

  selectText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },

  optionList: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginBottom: 12,
    overflow: "hidden",
  },

  optionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  selectedOption: {
    backgroundColor: "#dbeafe",
  },

  optionText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },

  loadingRoutes: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
  },

  loadingRoutesText: {
    marginTop: 8,
    color: "#64748b",
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 30,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});