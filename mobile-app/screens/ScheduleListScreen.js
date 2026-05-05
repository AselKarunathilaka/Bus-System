import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const DEFAULT_FORM = {
  routeId: "",
  busId: "",
  departureDate: "",
  departureTime: "",
  status: "Scheduled",
};

const STATUS_OPTIONS = ["Scheduled", "In Transit", "Completed", "Cancelled"];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const getCollectionArray = (payload, keys = []) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  for (const key of keys) {
    if (Array.isArray(payload?.data?.[key])) {
      return payload.data[key];
    }
  }

  return [];
};

const getReadableError = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const maskDateInput = (input = "") => {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  const yyyy = digits.slice(0, 4);
  const mm = digits.slice(4, 6);
  const dd = digits.slice(6, 8);

  if (digits.length <= 4) {
    return yyyy;
  }

  if (digits.length <= 6) {
    return `${yyyy}-${mm}`;
  }

  return `${yyyy}-${mm}-${dd}`;
};

const maskTimeInput = (input = "") => {
  const digits = input.replace(/\D/g, "").slice(0, 4);
  const hhRaw = digits.slice(0, 2);
  const mmRaw = digits.slice(2, 4);

  if (digits.length <= 2) {
    return hhRaw;
  }

  let hh = Number(hhRaw);
  let mm = Number(mmRaw || "0");

  if (!Number.isNaN(hh)) {
    hh = Math.min(Math.max(hh, 0), 23);
  }

  if (!Number.isNaN(mm)) {
    mm = Math.min(Math.max(mm, 0), 59);
  }

  const safeHh = Number.isNaN(hh) ? hhRaw : String(hh).padStart(2, "0");
  const safeMm =
    digits.length === 3
      ? mmRaw
      : Number.isNaN(mm)
      ? mmRaw
      : String(mm).padStart(2, "0");

  return `${safeHh}:${safeMm}`;
};

const statusStyleMap = {
  scheduled: "statusScheduled",
  "in transit": "statusInTransit",
  completed: "statusCompleted",
  cancelled: "statusCancelled",
};

const ScheduleListScreen = ({ navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const [schedules, setSchedules] = useState([]);
  const [routesList, setRoutesList] = useState([]);
  const [busesList, setBusesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [screenError, setScreenError] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const successTimerRef = useRef(null);

  const requestConfig = useMemo(
    () =>
      authToken
        ? {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        : undefined,
    [authToken]
  );

  const fetchSchedules = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setScreenError("");

      const response = await api.get("/schedules", requestConfig);
      setSchedules(getCollectionArray(response.data, ["schedules"]));
    } catch (error) {
      setScreenError(getReadableError(error, "Failed to load schedules"));
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [requestConfig]);

  const fetchModalDependencies = useCallback(async () => {
    try {
      const [routesResponse, busesResponse] = await Promise.all([
        api.get("/routes", requestConfig),
        api.get("/buses", requestConfig),
      ]);
      console.log("Routes API full response:", routesResponse);
      console.log("Routes API response.data:", routesResponse?.data);
      console.log("Routes API response.data.data:", routesResponse?.data?.data);
      console.log("Routes API response.data.routes:", routesResponse?.data?.routes);

      console.log("Buses API full response:", busesResponse);
      console.log("Buses API response.data:", busesResponse?.data);
      console.log("Buses API response.data.data:", busesResponse?.data?.data);
      console.log("Buses API response.data.buses:", busesResponse?.data?.buses);

      const extractedRoutes = getCollectionArray(routesResponse?.data, [
        "routes",
        "route",
      ]);
      const extractedBuses = getCollectionArray(busesResponse?.data, [
        "buses",
        "bus",
      ]);

      console.log("Extracted routes array:", extractedRoutes);
      console.log("Extracted buses array:", extractedBuses);

      setRoutesList(extractedRoutes);
      setBusesList(extractedBuses);
    } catch (error) {
      Alert.alert(
        "Error",
        getReadableError(error, "Failed to fetch route and bus options")
      );
    }
  }, [requestConfig]);

  const loadInitialData = useCallback(async () => {
    await Promise.all([fetchSchedules(false), fetchModalDependencies()]);
  }, [fetchSchedules, fetchModalDependencies]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadInitialData);
    return unsubscribe;
  }, [navigation, loadInitialData]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const showSuccessBanner = (message) => {
    setSuccessMessage(message);
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = setTimeout(() => {
      setSuccessMessage("");
      successTimerRef.current = null;
    }, 3000);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      routeId: "",
      busId: "",
      departureDate: "",
      departureTime: "",
      status: "Scheduled",
    });
    setModalVisible(true);
  };

  const openEditModal = (schedule) => {
    setEditingId(schedule._id);
    setFormData({
      routeId: schedule?.routeId?._id || "",
      busId: schedule?.busId?._id || "",
      departureDate: schedule?.departureDate
        ? schedule.departureDate.split("T")[0]
        : "",
      departureTime: schedule?.departureTime || "",
      status: schedule?.status || "Scheduled",
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setModalVisible(false);
    setEditingId(null);
    setFormData(DEFAULT_FORM);
  };

  const validateForm = () => {
    const routeId = formData.routeId?.trim();
    const busId = formData.busId?.trim();
    const departureDate = formData.departureDate?.trim();
    const departureTime = formData.departureTime?.trim();
    const status = formData.status?.trim();

    if (!routeId || !busId) {
      console.log("Validation failed: routeId or busId missing", formData);
      Alert.alert("Validation Error", "Please select both a route and a bus.");
      return false;
    }

    if (!departureDate || !departureTime || !status) {
      console.log("Validation failed: departureDate or departureTime missing", formData);
      Alert.alert("Validation Error", "Date, time, and status are required.");
      return false;
    }

    if (!DATE_REGEX.test(departureDate)) {
      console.log("Validation failed: invalid departureDate format", departureDate);
      Alert.alert("Validation Error", "Date must be in YYYY-MM-DD format.");
      return false;
    }

    if (!TIME_REGEX.test(departureTime)) {
      console.log("Validation failed: invalid departureTime format", departureTime);
      Alert.alert("Validation Error", "Time must be in HH:MM (24-hour) format.");
      return false;
    }

    if (!STATUS_OPTIONS.includes(status)) {
      console.log("Validation failed: invalid status", status);
      Alert.alert("Validation Error", "Please choose a valid schedule status.");
      return false;
    }

    return true;
  };

  const buildSchedulePayload = () => ({
    routeId: formData.routeId?.trim(),
    busId: formData.busId?.trim(),
    departureDate: formData.departureDate?.trim(),
    departureTime: formData.departureTime?.trim(),
    status: formData.status?.trim(),
  });

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const payload = buildSchedulePayload();
      const isUpdate = Boolean(editingId);
      console.log("Sending payload:", payload);

      if (isUpdate) {
        await api.put(`/schedules/${editingId}`, payload, requestConfig);
      } else {
        await api.post("/schedules", payload, requestConfig);
      }

      setModalVisible(false);
      setEditingId(null);
      setFormData(DEFAULT_FORM);
      await fetchSchedules(false);
      showSuccessBanner(
        isUpdate
          ? "Schedule updated successfully!"
          : "Schedule created successfully!"
      );
    } catch (error) {
      console.error("API Error:", error?.response?.data || error);
      const errorMessage = getReadableError(error, "Failed to save schedule");
      Alert.alert("Action Failed", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!scheduleId) {
      return;
    }

    try {
      console.log("Attempting to delete schedule ID:", scheduleId);
      await api.delete(`/schedules/${scheduleId}`, requestConfig);
      await fetchSchedules(false);
      showSuccessBanner("Schedule deleted successfully!");
    } catch (error) {
      Alert.alert(
        "Delete Failed",
        error?.response?.data?.message || error?.message || "Failed to delete schedule"
      );
    }
  };

  const confirmDelete = (id) => {
    console.log("Delete button physically clicked for ID:", id);
    setSelectedScheduleId(id);
    setDeleteModalVisible(true);
  };

  const getStatusStyle = (statusValue) => {
    const key = statusStyleMap[statusValue?.toLowerCase()] || "statusScheduled";
    return styles[key];
  };

  const renderHeader = () => (
    <>
      <View style={styles.headerCard}>
        <Text style={styles.badge}>QuickBus (Highway Bus Reservation System)</Text>
        <Text style={styles.headerTitle}>Manage Schedules</Text>
        <Text style={styles.headerSubtitle}>
          Create and manage route schedules with route, bus, date, time, and
          status information.
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
        <Text style={styles.buttonText}>Add Schedule</Text>
      </TouchableOpacity>

      {!!screenError && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Unable to load schedules</Text>
          <Text style={styles.errorMessage}>{screenError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchSchedules(false)}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderScheduleItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.routeName}>{item?.routeId?.routeName || "N/A"}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(item?.status)]}>
          {item?.status || "Scheduled"}
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Bus Number</Text>
          <Text style={styles.metricValue}>
            {item?.busId?.licenseNumber || item?.busId?.busName || "N/A"}
          </Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Date</Text>
          <Text style={styles.metricValue}>{formatDate(item?.departureDate)}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Time</Text>
          <Text style={styles.metricValue}>{item?.departureTime || "N/A"}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Status</Text>
          <Text style={styles.metricValue}>{item?.status || "Scheduled"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
        <Text style={styles.buttonText}>Edit Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Text style={styles.buttonText}>Delete Schedule</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loaderText}>Loading schedules...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!successMessage && (
        <View style={styles.successBanner}>
          <Text style={styles.successBannerText}>{successMessage}</Text>
        </View>
      )}

      <FlatList
        data={schedules}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {screenError ? "No schedules to display" : "No schedules found"}
          </Text>
        }
        renderItem={renderScheduleItem}
        refreshing={refreshing}
        onRefresh={() => fetchSchedules(true)}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Schedule" : "Create Schedule"}
            </Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <Text style={styles.inputLabel}>Route</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={formData.routeId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, routeId: value }))
                  }
                >
                  <Picker.Item label="Select a route..." value="" enabled={false} />
                  {routesList.map((route) => (
                    <Picker.Item
                      key={route._id}
                      label={route.routeName || "Unnamed Route"}
                      value={route._id}
                    />
                  ))}
                </Picker>
              </View>
              {!routesList.length && (
                <Text style={styles.pickerHintText}>No routes loaded</Text>
              )}

              <Text style={styles.inputLabel}>Bus</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={formData.busId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, busId: value }))
                  }
                >
                  <Picker.Item label="Select a bus..." value="" enabled={false} />
                  {busesList.map((bus) => (
                    <Picker.Item
                      key={bus._id}
                      label={
                        bus?.busName || bus?.licenseNumber
                          ? `${bus?.busName || "Unnamed Bus"} (${bus?.licenseNumber || "No License"})`
                          : "Unknown Bus"
                      }
                      value={bus._id}
                    />
                  ))}
                </Picker>
              </View>
              {!busesList.length && (
                <Text style={styles.pickerHintText}>No buses loaded</Text>
              )}

              <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                value={formData.departureDate}
                onChangeText={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    departureDate: maskDateInput(value),
                  }))
                }
                keyboardType="number-pad"
                maxLength={10}
              />

              <Text style={styles.inputLabel}>Time (HH:MM)</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                placeholderTextColor="#94a3b8"
                value={formData.departureTime}
                onChangeText={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    departureTime: maskTimeInput(value),
                  }))
                }
                keyboardType="number-pad"
                maxLength={5}
              />

              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.pickerWrap}>
                <Picker
                  style={styles.picker}
                  selectedValue={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <Picker.Item key={status} label={status} value={status} />
                  ))}
                </Picker>
              </View>
            </ScrollView>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
                disabled={submitting}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {editingId ? "Update" : "Create"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.deleteWarningText}>
              Are you sure you want to delete this schedule?
            </Text>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setSelectedScheduleId(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={async () => {
                  const scheduleId = selectedScheduleId;
                  setDeleteModalVisible(false);
                  setSelectedScheduleId(null);
                  await handleDeleteSchedule(scheduleId);
                }}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  successBanner: {
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: -2,
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 2,
  },
  successBannerText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef4ff",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#475569",
  },
  headerCard: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
  },
  headerSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
  },
  addButton: {
    backgroundColor: "#3567e0",
    padding: 15,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  routeName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginRight: 10,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  metricBox: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: "hidden",
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  statusScheduled: {
    backgroundColor: "#3567e0",
  },
  statusInTransit: {
    backgroundColor: "#ea580c",
  },
  statusCompleted: {
    backgroundColor: "#1cab4c",
  },
  statusCancelled: {
    backgroundColor: "#ea2424",
  },
  editButton: {
    backgroundColor: "#f4a20b",
    padding: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  deleteButton: {
    backgroundColor: "#ea2424",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  errorCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorTitle: {
    color: "#991b1b",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  errorMessage: {
    color: "#7f1d1d",
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#3567e0",
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    maxHeight: "90%",
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
    textAlign: "center",
  },
  modalScroll: {
    maxHeight: 420,
  },
  modalContent: {
    paddingBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    color: "#000000",
    marginBottom: 12,
  },
  pickerHintText: {
    marginTop: -4,
    marginBottom: 12,
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: "600",
  },
  modalActionRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  deleteWarningText: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#475569",
    paddingVertical: 14,
    borderRadius: 14,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#1cab4c",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: "#ea2424",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ScheduleListScreen;