import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";

const AdminDashboardScreen = ({ navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeRoutes: 0,
    totalBuses: 0,
    availableBuses: 0,
    maintenanceBuses: 0,
  });

  const [chartData, setChartData] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Fetch all required data concurrently
      const [routesRes, busesRes, bookingsRes] = await Promise.all([
        api.get("/routes", { headers }),
        api.get("/buses", { headers }),
        api.get("/bookings/admin", { headers }),
      ]);

      const routes = routesRes.data || [];
      const buses = busesRes.data || [];
      const bookings = bookingsRes.data || [];

      // Calculate Metrics
      const activeRoutes = routes.filter((r) => r.status === "active").length;
      const totalBuses = buses.length;
      const availableBuses = buses.filter((b) => b.status === "Available").length;
      const maintenanceBuses = buses.filter((b) => b.status === "Maintenance").length;

      let totalRevenue = 0;
      let totalBookings = 0;

      // Group bookings by day for the chart
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
          dateString: d.toISOString().split("T")[0],
          dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
          count: 0,
        };
      }).reverse();

      bookings.forEach((booking) => {
        // Only count paid/confirmed bookings in revenue
        if (booking.status === "Confirmed") {
          totalRevenue += booking.totalPrice || 0;
        }
        totalBookings++;

        // Try to place booking in chart based on createdAt
        if (booking.createdAt) {
          const bookingDate = booking.createdAt.split("T")[0];
          const dayMatch = last7Days.find((d) => d.dateString === bookingDate);
          if (dayMatch) {
            dayMatch.count += 1;
          }
        }
      });

      setMetrics({
        totalRevenue,
        totalBookings,
        activeRoutes,
        totalBuses,
        availableBuses,
        maintenanceBuses,
      });

      // Normalize chart data to percentages (0-100) for UI flex heights
      const maxCount = Math.max(...last7Days.map((d) => d.count), 1); // avoid div by 0
      const processedChartData = last7Days.map((d) => ({
        ...d,
        heightPercentage: (d.count / maxCount) * 100,
      }));

      setChartData(processedChartData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3567e0" />
        <Text style={styles.loadingText}>Compiling Analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3567e0" />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Overview</Text>
        <Text style={styles.headerSubtitle}>Real-time metrics and analytics</Text>
      </View>

      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderTopColor: "#10b981" }]}>
          <Text style={styles.kpiLabel}>Total Revenue</Text>
          <Text style={styles.kpiValue}>
            <Text style={styles.kpiCurrency}>LKR</Text> {metrics.totalRevenue.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.kpiCard, { borderTopColor: "#3b82f6" }]}>
          <Text style={styles.kpiLabel}>Total Bookings</Text>
          <Text style={styles.kpiValue}>{metrics.totalBookings}</Text>
        </View>

        <View style={[styles.kpiCard, { borderTopColor: "#f59e0b" }]}>
          <Text style={styles.kpiLabel}>Active Routes</Text>
          <Text style={styles.kpiValue}>{metrics.activeRoutes}</Text>
        </View>

        <View style={[styles.kpiCard, { borderTopColor: "#8b5cf6" }]}>
          <Text style={styles.kpiLabel}>Total Buses</Text>
          <Text style={styles.kpiValue}>{metrics.totalBuses}</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Booking Volume (Last 7 Days)</Text>
        <View style={styles.barChartContainer}>
          {chartData.map((dataPoint, index) => (
            <View key={index} style={styles.barColumn}>
              <Text style={styles.barValue}>{dataPoint.count > 0 ? dataPoint.count : ""}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${dataPoint.heightPercentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{dataPoint.dayLabel}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Fleet Status Breakdown</Text>
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeLegend}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
              <Text style={styles.legendText}>Available ({metrics.availableBuses})</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
              <Text style={styles.legendText}>Maintenance ({metrics.maintenanceBuses})</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFillAvailable,
                { flex: metrics.availableBuses || 1 },
              ]}
            />
            <View
              style={[
                styles.progressFillMaintenance,
                { flex: metrics.maintenanceBuses || 0 },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.footerSpacer} />
    </ScrollView>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  kpiCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  kpiLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  kpiValue: {
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "800",
  },
  kpiCurrency: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  chartCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
  },
  barChartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    paddingTop: 20,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  barValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b82f6",
    marginBottom: 4,
    height: 16,
  },
  barTrack: {
    width: 24,
    height: 120,
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    backgroundColor: "#3b82f6",
    width: "100%",
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 8,
  },
  gaugeContainer: {
    marginTop: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  progressTrack: {
    flexDirection: "row",
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    marginTop: 10,
  },
  progressFillAvailable: {
    backgroundColor: "#10b981",
  },
  progressFillMaintenance: {
    backgroundColor: "#ef4444",
  },
  footerSpacer: {
    height: 40,
  },
});
