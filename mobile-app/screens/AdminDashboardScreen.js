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
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";

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
      <LiquidBackground>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text className="mt-4 text-slate-400 font-bold text-base">Compiling Analytics...</Text>
        </View>
      </LiquidBackground>
    );
  }

  return (
    <LiquidBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
        }
      >
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <View>
                <Text className="text-3xl font-bold text-white tracking-tight">System Overview</Text>
                <Text className="text-sm text-slate-400 mt-1">Real-time metrics (updates every 15s)</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-white/10 border border-white/10 flex-row items-center px-4 py-2 rounded-full" onPress={generatePDFReport}>
              <Ionicons name="document-text" size={18} color="#38bdf8" />
              <Text className="text-[#38bdf8] font-bold ml-2">Export PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-lg font-bold text-white mb-3 mt-2 tracking-tight">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          <View className="w-[31%]">
            <GlassButton
              title="Routes"
              variant="glass"
              className="flex-col h-24 border-[#0ea5e9]/30 bg-[#0ea5e9]/10"
              textClassName="mt-2 text-sm text-white font-bold"
              icon={<View className="bg-[#0ea5e9]/20 p-2 rounded-full border border-[#0ea5e9]/40"><Ionicons name="map" size={20} color="#7dd3fc" /></View>}
              onPress={() => navigation.navigate("Routes")}
            />
          </View>
          <View className="w-[31%]">
            <GlassButton
              title="Buses"
              variant="glass"
              className="flex-col h-24 border-[#a855f7]/30 bg-[#a855f7]/10"
              textClassName="mt-2 text-sm text-white font-bold"
              icon={<View className="bg-[#a855f7]/20 p-2 rounded-full border border-[#a855f7]/40"><Ionicons name="bus" size={20} color="#d8b4fe" /></View>}
              onPress={() => navigation.navigate("Buses")}
            />
          </View>
          <View className="w-[31%]">
            <GlassButton
              title="Schedules"
              variant="glass"
              className="flex-col h-24 border-[#f43f5e]/30 bg-[#f43f5e]/10"
              textClassName="mt-2 text-sm text-white font-bold"
              icon={<View className="bg-[#f43f5e]/20 p-2 rounded-full border border-[#f43f5e]/40"><Ionicons name="calendar" size={20} color="#fda4af" /></View>}
              onPress={() => navigation.navigate("ScheduleList")}
            />
          </View>
        </View>

        <GlassCard className="mb-4">
          <Text className="text-base font-bold text-white mb-3">Archival Date Filter</Text>
          <View className="flex-row justify-between mb-2">
            <View className="w-[48%]">
              <Text className="text-xs text-slate-400 mb-1 font-semibold uppercase">Start Date</Text>
              {Platform.OS === 'web' ? (
                <input 
                  type="date" 
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    color: "#ffffff",
                    width: "100%",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              ) : (
                <TextInput
                  className="border border-white/10 p-3 rounded-lg bg-black/40 text-white"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94a3b8"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              )}
            </View>
            <View className="w-[48%]">
              <Text className="text-xs text-slate-400 mb-1 font-semibold uppercase">End Date</Text>
              {Platform.OS === 'web' ? (
                <input 
                  type="date" 
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    color: "#ffffff",
                    width: "100%",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              ) : (
                <TextInput
                  className="border border-white/10 p-3 rounded-lg bg-black/40 text-white"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94a3b8"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              )}
            </View>
          </View>
          {(startDate || endDate) && (
            <TouchableOpacity className="items-center mt-3" onPress={() => { setStartDate(""); setEndDate(""); }}>
              <Text className="text-[#38bdf8] font-bold text-sm">Clear Filters (Show All Time)</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        <View className="flex-row flex-wrap justify-between mb-2">
          <GlassCard className="w-[48%] mb-4 border border-emerald-400/40 bg-emerald-400/10" style={{ shadowColor: "#34d399" }}>
            <Text className="text-emerald-300 text-xs font-bold mb-2 uppercase tracking-widest">Revenue</Text>
            <Text className="text-white text-2xl font-black">
              <Text className="text-sm font-semibold text-emerald-300/80">LKR</Text> {metrics.totalRevenue.toLocaleString()}
            </Text>
          </GlassCard>

          <GlassCard className="w-[48%] mb-4 border border-blue-400/40 bg-blue-400/10" style={{ shadowColor: "#60a5fa" }}>
            <Text className="text-blue-300 text-xs font-bold mb-2 uppercase tracking-widest">Bookings</Text>
            <Text className="text-white text-2xl font-black">{metrics.totalBookings}</Text>
          </GlassCard>

          <GlassCard className="w-[48%] mb-4 border border-amber-400/40 bg-amber-400/10" style={{ shadowColor: "#fbbf24" }}>
            <Text className="text-amber-300 text-xs font-bold mb-2 uppercase tracking-widest">Active Routes</Text>
            <Text className="text-white text-2xl font-black">{metrics.activeRoutes}</Text>
          </GlassCard>

          <GlassCard className="w-[48%] mb-4 border border-violet-400/40 bg-violet-400/10" style={{ shadowColor: "#a78bfa" }}>
            <Text className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-widest">Total Buses</Text>
            <Text className="text-white text-2xl font-black">{metrics.totalBuses}</Text>
          </GlassCard>
        </View>

        <GlassCard className="mb-5">
          <Text className="text-lg font-bold text-white mb-4 tracking-tight">Booking Volume (7 Days Ending in Filter)</Text>
          <View className="flex-row justify-between items-end h-48 pt-5">
                {chartData.map((dataPoint, index) => (
              <View key={index} className="items-center flex-1">
                <Text className="text-xs font-bold text-[#38bdf8] mb-1 h-4">{dataPoint.count > 0 ? dataPoint.count : ""}</Text>
                <View className="w-6 h-32 bg-white/10 rounded-full justify-end overflow-hidden border border-white/5">
                  <View
                    className="bg-gradient-to-t from-blue-600 to-cyan-400 w-full rounded-full bg-cyan-400"
                    style={{ height: `${dataPoint.heightPercentage}%` }}
                  />
                </View>
                <Text className="text-xs text-slate-400 font-semibold mt-2">{dataPoint.dayLabel}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard className="mb-10">
          <Text className="text-lg font-bold text-white mb-2 tracking-tight">Fleet Status Breakdown</Text>
          <View className="mt-2">
            <View>
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 rounded-full mr-2 bg-emerald-400" />
                <Text className="text-sm font-semibold text-slate-300">Available ({metrics.availableBuses})</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 rounded-full mr-2 bg-amber-400" />
                <Text className="text-sm font-semibold text-slate-300">Maintenance ({metrics.maintenanceBuses})</Text>
              </View>
            </View>

            <View className="flex-row h-6 rounded-full overflow-hidden bg-white/10 mt-2">
              <View
                className="bg-emerald-400"
                style={{ flex: metrics.availableBuses || 1 }}
              />
              <View
                className="bg-amber-400"
                style={{ flex: metrics.maintenanceBuses || 0 }}
              />
            </View>
          </View>
        </GlassCard>

      </ScrollView>
    </LiquidBackground>
  );
};

export default AdminDashboardScreen;

// We've moved styles to Tailwind classes!
