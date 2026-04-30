import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

const UserAnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    usersByRole: {
      admin: 0,
      passenger: 0,
    },
    newUsersLast30Days: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/users/analytics`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = response?.data || {};
        setAnalytics({
          totalUsers: data.totalUsers || 0,
          usersByRole: {
            admin: data.usersByRole?.admin || 0,
            passenger: data.usersByRole?.passenger || 0,
          },
          newUsersLast30Days: data.newUsersLast30Days || 0,
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load user analytics. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Failed to Load Data</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>User Analytics Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Registered Users</Text>
        <Text style={styles.cardValue}>{analytics.totalUsers}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Users by Role</Text>
        <View style={styles.roleRow}>
          <View style={styles.rolePill}>
            <Text style={styles.roleLabel}>Admin</Text>
            <Text style={styles.roleValue}>{analytics.usersByRole.admin}</Text>
          </View>
          <View style={styles.rolePill}>
            <Text style={styles.roleLabel}>Passenger</Text>
            <Text style={styles.roleValue}>
              {analytics.usersByRole.passenger}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>New Registrations (Last 30 Days)</Text>
        <Text style={styles.cardValue}>{analytics.newUsersLast30Days}</Text>
      </View>
    </ScrollView>
  );
};

export default UserAnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#334155",
    fontSize: 15,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0f172a",
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  rolePill: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  roleLabel: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 6,
  },
  roleValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  errorCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 16,
  },
  errorTitle: {
    color: "#b91c1c",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorText: {
    color: "#7f1d1d",
    lineHeight: 20,
  },
});
