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
      <View style={styles.heroCard}>
        <Text style={styles.badge}>
          QuickBus Highway Bus Reservation System
        </Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          QuickBus helps you view highway bus routes, stop details, bus details,
          prices, and travel distances in one simple place.
        </Text>
      </View>

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

      {!isAdmin ? (
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About QuickBus</Text>
          <Text style={styles.aboutText}>
            QuickBus helps users browse available highway bus routes, stops, bus
            details, starting points, destinations, prices, and travel distance.
          </Text>
        </View>
      ) : (
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Admin Instructions</Text>

          <Text style={styles.aboutText}>
            As an admin, you can manage route, stop, and bus data shown to
            users.
          </Text>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>What you can do</Text>
            <Text style={styles.roleText}>
              • Add, edit, and delete routes{"\n"}
              • Manage route stops{"\n"}
              • Add, edit, and delete buses{"\n"}
              • Assign buses to routes{"\n"}
              • View bus status details
            </Text>
          </View>
        </View>
      )}

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
        style={[styles.actionButton, styles.scheduleButton]}
        onPress={() => navigation.navigate("ScheduleList")}
      >
        <Text style={styles.buttonText}>
          {isAdmin ? "Manage Schedules" : "View Schedules"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.busButton]}
        onPress={() => navigation.navigate("Buses")}
      >
        <Text style={styles.buttonText}>
          {isAdmin ? "Manage Buses" : "View Buses"}
        </Text>
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

  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },

  badge: {
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
    alignSelf: "flex-start",
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 8,
    lineHeight: 21,
  },

  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  aboutCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#0f172a",
  },

  infoRow: {
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 12,
    color: "#64748b",
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },

  aboutText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#334155",
    lineHeight: 21,
  },

  roleBlock: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  roleTitle: {
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 5,
  },

  roleText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
  },

  actionButton: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },

  profileButton: {
    backgroundColor: "#3567e0",
  },

  routeButton: {
    backgroundColor: "#1cab4c",
  },

  scheduleButton: {
    backgroundColor: "#ea580c", 
  },

  busButton: {
    backgroundColor: "#7c3aed",
  },

  logoutButton: {
    backgroundColor: "#ea2424",
  },

  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "700",
  },
});