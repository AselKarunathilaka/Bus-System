import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Routes")} style={{ marginLeft: 15 }}>
            <Ionicons name="map-outline" size={24} color="#3567e0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(isAdmin ? "ScheduleList" : "UserScheduleList")} style={{ marginLeft: 15 }}>
            <Ionicons name="calendar-outline" size={24} color="#3567e0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Buses")} style={{ marginLeft: 15 }}>
            <Ionicons name="bus-outline" size={24} color="#3567e0" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isAdmin]);

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

      <Text style={styles.gridTitle}>Quick Actions</Text>
      
      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate("Routes")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#e0f2fe" }]}>
            <Ionicons name="map" size={28} color="#0284c7" />
          </View>
          <Text style={styles.gridCardTitle}>
            {isAdmin ? "Manage Routes" : "Browse Routes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate("Buses")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#f3e8ff" }]}>
            <Ionicons name="bus" size={28} color="#9333ea" />
          </View>
          <Text style={styles.gridCardTitle}>
            {isAdmin ? "Manage Buses" : "View Buses"}
          </Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate("ScheduleList")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#ffedd5" }]}>
              <Ionicons name="calendar" size={28} color="#ea580c" />
            </View>
            <Text style={styles.gridCardTitle}>Manage Schedules</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate("UserScheduleList")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#dcfce7" }]}>
            <Ionicons name="ticket" size={28} color="#16a34a" />
          </View>
          <Text style={styles.gridCardTitle}>Book a Ticket</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.subtleLogout}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.subtleLogoutText}>Log Out</Text>
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

  gridTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 10,
    marginBottom: 15,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridCard: {
    backgroundColor: "#ffffff",
    width: "48%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  gridCardTitle: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: 14,
    textAlign: "center",
  },

  subtleLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
  },

  subtleLogoutText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});