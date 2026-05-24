import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const AdminDashboardScreen = ({ navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeRoutes: 0,
    totalBuses: 0,
    availableBuses: 0,
    maintenanceBuses: 0,
  });

  const [chartData, setChartData] = useState([]);
  
  // Keep raw data in ref so we don't have to fetch repeatedly just to filter
  const rawDataRef = useRef({ bookings: [], routes: [], buses: [] });

  const processData = useCallback(() => {
    const { bookings, routes, buses } = rawDataRef.current;

    const activeRoutes = routes.filter((r) => r.status === "active").length;
    const totalBuses = buses.length;
    const availableBuses = buses.filter((b) => b.status === "Available").length;
    const maintenanceBuses = buses.filter((b) => b.status === "Maintenance").length;

    let filteredBookings = bookings;

    // Apply archival date filtering
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + 86400000; // Add 1 day to include end date

      filteredBookings = bookings.filter((b) => {
        if (!b.createdAt) return false;
        const bTime = new Date(b.createdAt).getTime();
        return bTime >= start && bTime <= end;
      });
    }

    let totalRevenue = 0;
    let totalBookings = 0;

    // Group bookings by day for the chart (always based on filtered bookings)
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = endDate ? new Date(endDate) : new Date();
        d.setDate(d.getDate() - i);
        return {
          dateString: d.toISOString().split("T")[0],
          dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
          count: 0,
        };
      })
      .reverse();

    filteredBookings.forEach((booking) => {
      // Only count paid/confirmed bookings in revenue
      if (booking.status === "Confirmed") {
        totalRevenue += booking.totalPrice || 0;
      }
      totalBookings++;

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

    const maxCount = Math.max(...last7Days.map((d) => d.count), 1);
    const processedChartData = last7Days.map((d) => ({
      ...d,
      heightPercentage: (d.count / maxCount) * 100,
    }));

    setChartData(processedChartData);
  }, [startDate, endDate]);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const headers = { Authorization: `Bearer ${authToken}` };

      // Fixed: Using /bookings for admin to get all
      const [routesRes, busesRes, bookingsRes] = await Promise.all([
        api.get("/routes", { headers }),
        api.get("/buses", { headers }),
        api.get("/bookings", { headers }),
      ]);

      rawDataRef.current = {
        routes: routesRes.data || [],
        buses: busesRes.data || [],
        bookings: bookingsRes.data || [],
      };

      processData();
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      if (!isSilent) setLoading(false);
      setRefreshing(false);
    }
  }, [authToken, processData]);

  // Initial fetch and Real-time Polling
  useEffect(() => {
    fetchDashboardData();

    // Poll every 15 seconds silently
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Re-process when dates change without refetching
  useEffect(() => {
    if (!loading) {
      processData();
    }
  }, [startDate, endDate, processData, loading]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const generatePDFReport = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #0f172a; }
            h1 { color: #1e3a8a; text-align: center; }
            .header { text-align: center; margin-bottom: 40px; }
            .date-range { font-size: 14px; color: #64748b; }
            .metric-grid { display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 40px; }
            .metric-card { width: 45%; background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
            .metric-label { font-size: 14px; color: #64748b; margin-bottom: 8px; }
            .metric-value { font-size: 28px; font-weight: bold; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #334155; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>QuickBus Executive Report</h1>
            <div class="date-range">
              ${startDate && endDate ? `Report Period: ${startDate} to ${endDate}` : 'Report Period: All Time'}
            </div>
            <div class="date-range">Generated on: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="metric-grid">
            <div class="metric-card">
              <div class="metric-label">Total Revenue (LKR)</div>
              <div class="metric-value">${metrics.totalRevenue.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Bookings</div>
              <div class="metric-value">${metrics.totalBookings}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Active Routes</div>
              <div class="metric-value">${metrics.activeRoutes}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Buses</div>
              <div class="metric-value">${metrics.totalBuses} (Available: ${metrics.availableBuses})</div>
            </div>
          </div>

          <h2>Recent Booking Trends (Last 7 Days in Range)</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bookings Count</th>
              </tr>
            </thead>
            <tbody>
              ${chartData.map(d => `<tr><td>${d.dateString} (${d.dayLabel})</td><td>${d.count}</td></tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      if (Platform.OS === "web") {
        // On web, expo-print handles printing/saving dialog automatically
        Print.printAsync({ html: htmlContent });
      } else {
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("Report Generated", `Saved to: ${uri}`);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate PDF report.");
    }
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
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>System Overview</Text>
            <Text style={styles.headerSubtitle}>Real-time metrics (updates every 15s)</Text>
          </View>
          <TouchableOpacity style={styles.exportBtn} onPress={generatePDFReport}>
            <Ionicons name="document-text" size={18} color="#fff" />
            <Text style={styles.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Archival Date Filter</Text>
        <View style={styles.filterRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Start Date</Text>
            {Platform.OS === 'web' ? (
              <input 
                type="date" 
                style={styles.webDateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            ) : (
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                value={startDate}
                onChangeText={setStartDate}
              />
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>End Date</Text>
            {Platform.OS === 'web' ? (
              <input 
                type="date" 
                style={styles.webDateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            ) : (
              <TextInput
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={setEndDate}
              />
            )}
          </View>
        </View>
        {(startDate || endDate) && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => { setStartDate(""); setEndDate(""); }}>
            <Text style={styles.clearBtnText}>Clear Filters (Show All Time)</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderTopColor: "#10b981" }]}>
          <Text style={styles.kpiLabel}>Revenue</Text>
          <Text style={styles.kpiValue}>
            <Text style={styles.kpiCurrency}>LKR</Text> {metrics.totalRevenue.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.kpiCard, { borderTopColor: "#3b82f6" }]}>
          <Text style={styles.kpiLabel}>Bookings</Text>
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
        <Text style={styles.chartTitle}>Booking Volume (7 Days Ending in Filter)</Text>
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
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  exportBtn: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
  },
  exportBtnText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6,
  },
  filterCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  webDateInput: {
    border: "1px solid #cbd5e1",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    outline: "none",
  },
  clearBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#3567e0",
    fontWeight: "700",
    fontSize: 14,
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
