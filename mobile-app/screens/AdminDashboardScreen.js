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
import { getGreeting } from "../utils/timeUtils";

const AdminDashboardScreen = ({ navigation }) => {
  const { token, user } = useContext(AuthContext);

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
  const [recentBookings, setRecentBookings] = useState([]);
  
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

    const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setRecentBookings(sortedBookings.slice(0, 5));
  }, [startDate, endDate]);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [routesRes, busesRes, bookingsRes] = await Promise.all([
        api.get("/routes"),
        api.get("/buses"),
        api.get("/bookings"),
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
  }, [processData]);

  // Initial fetch and Real-time Polling
  useEffect(() => {
    fetchDashboardData();

    // Refresh instantly when screen is focused
    const unsubscribe = navigation.addListener("focus", () => {
      fetchDashboardData(true);
    });

    // Poll every 15 seconds silently
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 15000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [fetchDashboardData, navigation]);

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
          <ActivityIndicator size="large" color="#2F80ED" />
          <Text className="mt-4 text-textMuted font-bold text-base">Compiling Analytics...</Text>
        </View>
      </LiquidBackground>
    );
  }

  return (
    <LiquidBackground>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === 'web' ? 16 : 50 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ffffff" />
        }
      >
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.2)] p-2 rounded-full border border-[rgba(255,255,255,0.3)]">
                <Ionicons name="arrow-back" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <View>
                <Text className="text-2xl font-extrabold text-white tracking-tight">Admin Overview</Text>
                <Text className="text-xs text-slate-300 mt-1 font-semibold">{getGreeting(user?.fullName)}</Text>
              </View>
            </View>
            <TouchableOpacity className="bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] flex-row items-center px-4 py-2 rounded-full" onPress={generatePDFReport}>
              <Ionicons name="document-text" size={18} color="#60a5fa" />
              <Text className="text-blue-300 font-bold ml-2">Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-lg font-sans font-bold text-white mb-3 mt-2 tracking-tight">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[31%] mb-3">
            <GlassButton
              title="Routes"
              className="flex-col h-24 border border-blue-400/30"
              style={{ backgroundColor: "#3b82f6" }}
              textClassName="mt-2 text-sm text-[#FFFFFF] font-bold shadow-sm"
              icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="map" size={20} color="#FFFFFF" /></View>}
              onPress={() => navigation.navigate("Routes")}
            />
          </View>
          <View className="w-[31%] mb-3">
            <GlassButton
              title="Buses"
              className="flex-col h-24 border border-purple-400/30"
              style={{ backgroundColor: "#8b5cf6" }}
              textClassName="mt-2 text-sm text-[#FFFFFF] font-bold shadow-sm"
              icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="bus" size={20} color="#FFFFFF" /></View>}
              onPress={() => navigation.navigate("Buses")}
            />
          </View>
          <View className="w-[31%] mb-3">
            <GlassButton
              title="Schedules"
              className="flex-col h-24 border border-amber-400/30"
              style={{ backgroundColor: "#f59e0b" }}
              textClassName="mt-1 text-xs text-[#FFFFFF] font-bold shadow-sm"
              icon={<View className="bg-white/20 p-1.5 rounded-full"><Ionicons name="calendar" size={18} color="#FFFFFF" /></View>}
              onPress={() => navigation.navigate("ScheduleList")}
            />
          </View>
          <View className="w-[31%] mb-3">
            <GlassButton
              title="Bookings"
              className="flex-col h-24 border border-emerald-400/30"
              style={{ backgroundColor: "#10b981" }}
              textClassName="mt-2 text-sm text-[#FFFFFF] font-bold shadow-sm"
              icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="receipt" size={20} color="#FFFFFF" /></View>}
              onPress={() => navigation.navigate("BookingsTab")}
            />
          </View>
          <View className="w-[31%] mb-3">
            <GlassButton
              title="Book Ticket"
              className="flex-col h-24 border border-sky-400/30"
              style={{ backgroundColor: "#0ea5e9" }}
              textClassName="mt-2 text-[11px] text-[#FFFFFF] font-bold text-center shadow-sm"
              icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="ticket" size={20} color="#FFFFFF" /></View>}
              onPress={() => navigation.navigate("UserScheduleList")}
            />
          </View>
          <View className="w-[31%] mb-3">
            <GlassButton
              title="Manage Crew"
              className="flex-col h-24 border border-teal-400/30"
              style={{ backgroundColor: "#14b8a6" }}
              textClassName="mt-2 text-[11px] text-[#FFFFFF] font-bold text-center shadow-sm"
              icon={<View className="bg-white/20 p-2 rounded-full"><Ionicons name="people" size={20} color="#FFFFFF" /></View>}
              onPress={() => navigation.navigate("DriverManagement")}
            />
          </View>
        </View>

        <GlassCard className="mb-4">
          <Text className="text-sm font-sans font-bold text-textDark mb-2">Archival Date Filter</Text>
          <View className="flex-row justify-between items-center mb-1">
            <View className="w-[48%]">
              <Text className="text-[10px] text-textMuted mb-1 font-semibold uppercase">Start Date</Text>
              {Platform.OS === 'web' ? (
                <input 
                  type="date" 
                  style={{
                    border: "1px solid rgba(255,255,255,0.55)",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.35)",
                    color: "#102A43",
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
                  className="border border-[rgba(255,255,255,0.55)] p-2 rounded-lg bg-[rgba(255,255,255,0.35)] text-textDark text-sm font-sans"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#64748B"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              )}
            </View>
            <View className="w-[48%]">
              <Text className="text-[10px] text-textMuted mb-1 font-semibold uppercase">End Date</Text>
              {Platform.OS === 'web' ? (
                <input 
                  type="date" 
                  style={{
                    border: "1px solid rgba(255,255,255,0.55)",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255,255,255,0.35)",
                    color: "#102A43",
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
                  className="border border-[rgba(255,255,255,0.55)] p-2 rounded-lg bg-[rgba(255,255,255,0.35)] text-textDark text-sm font-sans"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#64748B"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              )}
            </View>
          </View>
          {(startDate || endDate) && (
            <TouchableOpacity className="items-center mt-2" onPress={() => { setStartDate(""); setEndDate(""); }}>
              <Text className="text-primary font-bold text-xs">Clear Filters (Show All Time)</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

        <Text className="text-lg font-sans font-bold text-white mb-3 tracking-tight">Performance Metrics</Text>
        <View className="flex-row flex-wrap justify-between mb-2">
          <View className="w-[48%] mb-3">
            <GlassCard className="border-[2px] border-[#059669] bg-green-50 p-5">
              <View className="flex-row items-center mb-2">
                <Ionicons name="wallet" size={18} color="#059669" />
                <Text className="text-[#059669] text-[11px] font-extrabold uppercase tracking-widest ml-2">Revenue</Text>
              </View>
              <Text className="text-[#0F172A] text-2xl font-sans font-black">
                <Text className="text-sm font-bold text-[#059669]">LKR</Text> {metrics.totalRevenue.toLocaleString()}
              </Text>
            </GlassCard>
          </View>

          <View className="w-[48%] mb-3">
            <GlassCard className="border-[2px] border-[#2563EB] bg-blue-50 p-5">
              <View className="flex-row items-center mb-2">
                <Ionicons name="ticket" size={18} color="#2563EB" />
                <Text className="text-[#2563EB] text-[11px] font-extrabold uppercase tracking-widest ml-2">Bookings</Text>
              </View>
              <Text className="text-[#0F172A] text-2xl font-sans font-black">{metrics.totalBookings}</Text>
            </GlassCard>
          </View>

          <View className="w-[48%] mb-3">
            <GlassCard className="border-[2px] border-[#0891B2] bg-cyan-50 p-5">
              <View className="flex-row items-center mb-2">
                <Ionicons name="map" size={18} color="#0891B2" />
                <Text className="text-[#0891B2] text-[11px] font-extrabold uppercase tracking-widest ml-2">Routes</Text>
              </View>
              <Text className="text-[#0F172A] text-2xl font-sans font-black">{metrics.activeRoutes}</Text>
            </GlassCard>
          </View>

          <View className="w-[48%] mb-3">
            <GlassCard className="border-[2px] border-[#9333EA] bg-purple-50 p-5">
              <View className="flex-row items-center mb-2">
                <Ionicons name="bus" size={18} color="#9333EA" />
                <Text className="text-[#9333EA] text-[11px] font-extrabold uppercase tracking-widest ml-2">Buses</Text>
              </View>
              <Text className="text-[#0F172A] text-2xl font-sans font-black">{metrics.totalBuses}</Text>
            </GlassCard>
          </View>
        </View>

        <GlassCard className="mb-4 p-4">
          <Text className="text-sm font-sans font-bold text-textDark mb-3 tracking-tight">Booking Volume (7 Days Ending in Filter)</Text>
          <View className="flex-row justify-between items-end h-32 pt-2">
                {chartData.map((dataPoint, index) => (
              <View key={index} className="items-center flex-1">
                <Text className="text-[10px] font-bold text-primary mb-1 h-3">{dataPoint.count > 0 ? dataPoint.count : ""}</Text>
                <View className="w-4 h-20 bg-[rgba(255,255,255,0.5)] rounded-full justify-end overflow-hidden border border-white/50">
                  <View
                    className="bg-gradient-to-t from-[#2563EB] to-[#06B6D4] w-full rounded-full bg-[#06B6D4]"
                    style={{ height: `${dataPoint.heightPercentage}%` }}
                  />
                </View>
                <Text className="text-[10px] text-textMuted font-sans font-semibold mt-1">{dataPoint.dayLabel}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard className="mb-6 p-4">
          <Text className="text-sm font-sans font-bold text-textDark mb-2 tracking-tight">Fleet Status Breakdown</Text>
          <View className="mt-1">
            <View>
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 rounded-full mr-2 bg-emerald-500" />
                <Text className="text-sm font-semibold text-slate-200">Available ({metrics.availableBuses})</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 rounded-full mr-2 bg-amber-500" />
                <Text className="text-sm font-semibold text-slate-200">Maintenance ({metrics.maintenanceBuses})</Text>
              </View>
            </View>

            <View className="flex-row h-6 rounded-full overflow-hidden bg-[rgba(255,255,255,0.5)] mt-2">
              <View
                className="bg-emerald-500"
                style={{ flex: metrics.availableBuses || 1 }}
              />
              <View
                className="bg-amber-500"
                style={{ flex: metrics.maintenanceBuses || 0 }}
              />
            </View>
          </View>
        </GlassCard>

        {recentBookings.length > 0 && (
          <GlassCard className="mb-10 p-4 border-[1.5px] border-white/60 bg-white/95">
            <Text className="text-base font-sans font-extrabold text-[#0F172A] mb-4 tracking-tight">Recent Bookings</Text>
            {recentBookings.map((bk, index) => (
              <View key={bk._id || index} className={`flex-row justify-between items-center py-3 ${index !== recentBookings.length - 1 ? 'border-b border-[#E2E8F0]' : ''}`}>
                <View className="flex-1 pr-2">
                  <Text className="text-[#0F172A] font-bold text-sm" numberOfLines={1}>{bk.schedule?.route?.routeName || "Unknown Route"}</Text>
                  <Text className="text-[#64748B] text-xs font-semibold mt-0.5">{new Date(bk.createdAt).toLocaleDateString()} • {bk.seats?.length || 0} Seats</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[#059669] font-black text-sm">LKR {bk.totalPrice}</Text>
                  <View className={`px-2 py-0.5 mt-1 rounded-full ${bk.status === 'Confirmed' ? 'bg-green-100' : 'bg-amber-100'}`}>
                    <Text className={`text-[10px] font-extrabold uppercase ${bk.status === 'Confirmed' ? 'text-green-700' : 'text-amber-700'}`}>{bk.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </GlassCard>
        )}

      </ScrollView>
    </LiquidBackground>
  );
};

export default AdminDashboardScreen;

// We've moved styles to Tailwind classes!
