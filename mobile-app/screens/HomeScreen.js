import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>User Overview</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{user?.fullName || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{user?.role || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>About QuickBus</Text>
        <Text style={styles.aboutText}>
          QuickBus is a highway bus reservation system for browsing routes,
          managing buses, and supporting schedule-based bookings.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, styles.profileButton]}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.routeButton]}
        onPress={() => navigation.navigate("Routes")}
      >
        <Text style={styles.buttonText}>
          {isAdmin ? "Manage Routes" : "Browse Routes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.busButton]}
        onPress={() => navigation.navigate("BusList")}
      >
        <Text style={styles.buttonText}>Bus Management</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.logoutButton]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#eef4ff",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 17,
    color: "#0f172a",
    fontWeight: "600",
  },
  aboutText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 23,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
  },
  profileButton: {
    backgroundColor: "#3567e0",
  },
  routeButton: {
    backgroundColor: "#1cab4c",
  },
  busButton: {
    backgroundColor: "#7c3aed",
  },
  logoutButton: {
    backgroundColor: "#ea2424",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 17,
  },
});