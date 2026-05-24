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
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              margin: 0; 
              padding: 0; 
              color: #1e293b; 
              background-color: #f8fafc;
            }
            .page {
              padding: 40px 50px;
              max-width: 800px;
              margin: 0 auto;
              background-color: #ffffff;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header-banner {
              background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
              color: #ffffff;
              padding: 30px;
              border-radius: 16px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header-title {
              margin: 0;
              font-size: 28px;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .header-subtitle {
              margin-top: 5px;
              font-size: 14px;
              color: #bfdbfe;
            }
            .timestamp {
              text-align: right;
              font-size: 12px;
              color: #dbeafe;
            }
            .section-title {
              font-size: 18px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
            }
            .metric-grid { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 20px; 
              margin-bottom: 40px; 
            }
            .metric-card { 
              flex: 1 1 calc(50% - 20px); 
              background: #ffffff; 
              padding: 24px; 
              border-radius: 16px; 
              border: 1px solid #e2e8f0;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
              position: relative;
              overflow: hidden;
            }
            .metric-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
            }
            .metric-card.revenue::before { background-color: #10b981; }
            .metric-card.bookings::before { background-color: #3b82f6; }
            .metric-card.routes::before { background-color: #f59e0b; }
            .metric-card.buses::before { background-color: #8b5cf6; }
            
            .metric-label { 
              font-size: 13px; 
              color: #64748b; 
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px; 
            }
            .metric-value { 
              font-size: 32px; 
              font-weight: 800; 
              color: #0f172a; 
            }
            .metric-subtext {
              font-size: 12px;
              color: #94a3b8;
              margin-top: 4px;
            }
            table { 
              width: 100%; 
              border-collapse: separate; 
              border-spacing: 0;
              margin-top: 10px; 
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            }
            th, td { 
              padding: 16px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0;
            }
            th { 
              background-color: #f8fafc; 
              color: #475569; 
              font-weight: 600;
              font-size: 13px;
              text-transform: uppercase;
            }
            tr:last-child td { border-bottom: none; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .count-badge {
              background: #eff6ff;
              color: #2563eb;
              padding: 4px 12px;
              border-radius: 99px;
              font-weight: 600;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header-banner">
              <div>
                <h1 class="header-title">QuickBus Analytics</h1>
                <div class="header-subtitle">
                  ${startDate && endDate ? `Data Range: ${startDate} to ${endDate}` : 'Lifetime Executive Report'}
                </div>
              </div>
              <div class="timestamp">
                Generated On<br/>
                <strong>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</strong>
              </div>
            </div>
            
            <h2 class="section-title">Key Performance Indicators</h2>
            <div class="metric-grid">
              <div class="metric-card revenue">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">LKR ${metrics.totalRevenue.toLocaleString()}</div>
                <div class="metric-subtext">Confirmed bookings only</div>
              </div>
              <div class="metric-card bookings">
                <div class="metric-label">Ticket Volume</div>
                <div class="metric-value">${metrics.totalBookings}</div>
                <div class="metric-subtext">Total tickets processed</div>
              </div>
              <div class="metric-card routes">
                <div class="metric-label">Active Routes</div>
                <div class="metric-value">${metrics.activeRoutes}</div>
                <div class="metric-subtext">Currently operational</div>
              </div>
              <div class="metric-card buses">
                <div class="metric-label">Fleet Size</div>
                <div class="metric-value">${metrics.totalBuses}</div>
                <div class="metric-subtext">${metrics.availableBuses} Available • ${metrics.maintenanceBuses} Maintenance</div>
              </div>
            </div>

            <h2 class="section-title">Recent Daily Volume (7-Day Trend)</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Tickets Booked</th>
                </tr>
              </thead>
              <tbody>
                ${chartData.map(d => `
                  <tr>
                    <td><strong>${d.dateString}</strong></td>
                    <td>${d.dayLabel}</td>
                    <td><span class="count-badge">${d.count}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === "web") {
        await Print.printAsync({ html: htmlContent });
      } else {
        const { uri } = await Print.printToFileAsync({
          html: htmlContent,
          base64: false
        });
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
