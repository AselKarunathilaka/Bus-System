import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  role: "passenger",
  password: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [screenError, setScreenError] = useState("");

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const isEditMode = useMemo(() => Boolean(selectedUser), [selectedUser]);

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage]);

  const getAuthConfig = async () => {
    const token = await AsyncStorage.getItem("token");
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : { headers: {} };
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setScreenError("");
    try {
      const config = await getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/users`, config);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setScreenError(
        error?.response?.data?.message || "Unable to fetch users right now."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const closeFormModal = () => {
    setFormModalVisible(false);
    setSelectedUser(null);
    setFormData(initialFormState);
    setFormError("");
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormData(initialFormState);
    setFormError("");
    setFormModalVisible(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "passenger",
      password: "",
    });
    setFormError("");
    setFormModalVisible(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteError("");
    setDeleteModalVisible(true);
  };

  const validateForm = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      return "Full name, email, and phone are required.";
    }

    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!isEditMode && !formData.password.trim()) {
      return "Password is required for new users.";
    }

    if (formData.password && formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!["passenger", "admin"].includes(formData.role)) {
      return "Role must be passenger or admin.";
    }

    return "";
  };

  const handleSaveUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);
    setFormError("");

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      role: formData.role,
    };

    if (formData.password.trim()) {
      payload.password = formData.password.trim();
    }

    try {
      const config = await getAuthConfig();
      if (isEditMode) {
        await axios.put(
          `${API_BASE_URL}/users/${selectedUser.id || selectedUser._id}`,
          payload,
          config
        );
        setSuccessMessage("User updated successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/users`, payload, config);
        setSuccessMessage("User added successfully.");
      }

      closeFormModal();
      await fetchUsers();
    } catch (error) {
      setFormError(
        error?.response?.data?.message || "Failed to save user. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setDeleteError("");
    try {
      const config = await getAuthConfig();
      await axios.delete(
        `${API_BASE_URL}/users/${selectedUser.id || selectedUser._id}`,
        config
      );
      setSuccessMessage("User deleted successfully.");
      setDeleteModalVisible(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      setDeleteError(
        error?.response?.data?.message || "Failed to delete user. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userText}>{item.email}</Text>
        <Text style={styles.userText}>{item.phone}</Text>
        <Text style={styles.userRole}>Role: {item.role}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => openDeleteModal(item)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {successMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      <View style={styles.headerRow}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {screenError ? <Text style={styles.errorText}>{screenError}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id || item._id)}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found.</Text>
          }
        />
      )}

      <Modal
        visible={formModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeFormModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {isEditMode ? "Edit User" : "Add User"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, fullName: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Role (passenger/admin)"
              autoCapitalize="none"
              value={formData.role}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, role: text.toLowerCase() }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder={
                isEditMode ? "Password (optional)" : "Password (min 6 chars)"
              }
              secureTextEntry
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
            />

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeFormModal}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSaveUser}
                disabled={submitting}
              >
                <Text style={styles.confirmButtonText}>
                  {submitting ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteCard}>
            <Text style={styles.deleteTitle}>Delete User</Text>
            <Text style={styles.warningText}>
              Are you sure you want to delete{" "}
              <Text style={styles.boldText}>
                {selectedUser?.fullName || "this user"}
              </Text>
              ? This action cannot be undone.
            </Text>

            {deleteError ? (
              <Text style={styles.errorText}>{deleteError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteError("");
                }}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteUser}
                disabled={submitting}
              >
                <Text style={styles.deleteConfirmText}>
                  {submitting ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  successBanner: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  successText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  loader: {
    marginTop: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  userDetails: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  userText: {
    color: "#334155",
    marginTop: 2,
  },
  userRole: {
    marginTop: 6,
    color: "#1e293b",
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#0ea5e9",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyText: {
    marginTop: 28,
    textAlign: "center",
    color: "#64748b",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e2e8f0",
  },
  cancelButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#2563eb",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  deleteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,
  },
  deleteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  warningText: {
    color: "#334155",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "700",
    color: "#0f172a",
  },
  deleteConfirmButton: {
    backgroundColor: "#dc2626",
  },
  deleteConfirmText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
