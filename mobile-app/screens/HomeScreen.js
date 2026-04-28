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
      {/* HERO SECTION */}
      <View style={styles.heroCard}>
        <Text style={styles.badge}>
          QuickBus (Highway Bus Reservation System)
        </Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          QuickBus helps you view highway bus routes, see stop details, and
          check prices and travel distances in one simple place.
        </Text>
      </View>

      {/* USER PROFILE */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>User Overview</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>
            {user?.fullName || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>
            {user?.email || "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>
            {user?.role || "N/A"}
          </Text>
        </View>
      </View>

      {/* ABOUT / ADMIN SECTION */}
      {!isAdmin ? (
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>About QuickBus</Text>
          <Text style={styles.aboutText}>
            QuickBus is a highway bus route app that helps you quickly explore
            available routes, starting points, destinations, prices, travel
            distance, and stop information.
          </Text>
        </View>
      ) : (
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Admin Instructions</Text>

          <Text style={styles.aboutText}>
            As an admin, you manage route data shown to users.
          </Text>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>What you can do</Text>
            <Text style={styles.roleText}>
              • Add routes{"\n"}
              • Edit routes{"\n"}
              • Delete routes{"\n"}
              • Manage stops{"\n"}
              • Filter routes
            </Text>
          </View>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>Admin Flow</Text>
            <Text style={styles.roleText}>
              1. Open Manage Routes{"\n"}
              2. Add / Edit Routes{"\n"}
              3. Manage Stops{"\n"}
              4. Delete if needed
            </Text>
          </View>
        </View>
      )}

      {/* BUTTONS */}
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
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: 8,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  aboutCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
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
  },

  aboutText: {
    fontSize: 14,
    marginBottom: 10,
  },

  roleBlock: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  roleTitle: {
    fontWeight: "800",
  },

  roleText: {
    fontSize: 13,
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

  busButton: {
    backgroundColor: "#7c3aed",
  },

  logoutButton: {
    backgroundColor: "#ea2424",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});