import React, { useContext } from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
=======
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
import { AuthContext } from "../context/AuthContext";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

<<<<<<< HEAD
  const isAdmin = user?.role === "admin";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.badge}>QuickBus (Highway Bus Reservation System)</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          QuickBus helps you view highway bus routes, see stop details, and
          check prices and travel distances in one simple place.
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
            QuickBus is a highway bus route app that helps you quickly explore
            available routes, starting points, destinations, prices, travel
            distance, and stop information. It is designed to make route viewing
            simple and clear for everyday users.
          </Text>
        </View>
      ) : (
        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Admin Instructions</Text>
          <Text style={styles.aboutText}>
            As an admin, you manage the route information shown to users in the
            system. This includes creating new highway routes, updating route
            details, and maintaining stop information so the app stays accurate
            and useful.
          </Text>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>What you can do</Text>
            <Text style={styles.roleText}>
              • Add new highway routes{"\n"}
              • Edit route name, start location, end location, price, distance,
              duration, description, and status{"\n"}
              • Delete routes that are no longer needed{"\n"}
              • Open a route and manage its stops{"\n"}
              • Add new stops to a route{"\n"}
              • Edit stop names, locations, and stop order{"\n"}
              • Delete stops from a route{"\n"}
              • Use route filters to quickly find specific routes by start
              location, price range, and distance range
            </Text>
          </View>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>How the admin flow works</Text>
            <Text style={styles.roleText}>
              1. Open Manage Routes{"\n"}
              2. Use filters if you want to find a specific route{"\n"}
              3. Tap Add Route to create a new route{"\n"}
              4. Tap Edit Route to update existing route details{"\n"}
              5. Tap Manage Stops to add, update, or remove stops for that
              route{"\n"}
              6. Tap Delete Route only when you want to fully remove a route
              from the system
            </Text>
          </View>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>Why this matters</Text>
            <Text style={styles.roleText}>
              The route data you manage is what normal users see in the app. By
              keeping routes, prices, distances, and stops updated, you make the
              system more useful and easier for users to understand.
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.actionButton, styles.profileButton]}
=======
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.text}>Name: {user?.fullName}</Text>
      <Text style={styles.text}>Email: {user?.email}</Text>
      <Text style={styles.text}>Role: {user?.role}</Text>

      <TouchableOpacity
        style={styles.button}
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
<<<<<<< HEAD
        style={[styles.actionButton, styles.routeButton]}
        onPress={() => navigation.navigate("Routes")}
      >
        <Text style={styles.buttonText}>
          {isAdmin ? "Manage Routes" : "Browse Routes"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.logoutButton]}
=======
        style={[styles.button, styles.routeButton]}
        onPress={() => navigation.navigate("Routes")}
      >
        <Text style={styles.buttonText}>Manage Routes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        onPress={logout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
<<<<<<< HEAD
    </ScrollView>
=======
    </View>
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#eef4ff",
  },
  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
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
    marginBottom: 14,
    overflow: "hidden",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#cbd5e1",
    lineHeight: 22,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  aboutCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 16,
  },
  roleBlock: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileButton: {
    backgroundColor: "#3567e0",
  },
  routeButton: {
    backgroundColor: "#1cab4c",
  },
  logoutButton: {
    backgroundColor: "#ea2424",
=======
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  routeButton: {
    backgroundColor: "#16a34a",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
<<<<<<< HEAD
    fontWeight: "800",
    fontSize: 17,
=======
    fontWeight: "600",
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
});