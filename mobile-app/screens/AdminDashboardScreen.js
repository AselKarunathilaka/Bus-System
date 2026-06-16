import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
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
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import { getGreeting } from "../utils/timeUtils";
import Svg, { G, Circle } from "react-native-svg";

const DonutChart = ({ data, radius = 40, strokeWidth = 15 }) => {
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;
  const center = radius + strokeWidth;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Svg height={center * 2} width={center * 2} viewBox={`0 0 ${center * 2} ${center * 2}`}>
      <G rotation="-90" origin={`${center}, ${center}`}>
        {total === 0 ? (
          <Circle cx={center} cy={center} r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="transparent" />
        ) : (
          data.map((item, index) => {
            if (item.percentage === 0) return null;
            const strokeDasharray = `${item.percentage * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset * circumference;
            currentOffset += item.percentage;
            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
              />
            );
          })
        )}
      </G>
    </Svg>
  );
};

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
    let statusCounts = { Confirmed: 0, Pending: 0, Cancelled: 0 };

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
      
      const stat = booking.status || "Pending";
      statusCounts[stat] = (statusCounts[stat] || 0) + 1;
      
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
      statusCounts,
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
      <AppLayout>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-4 text-textMuted font-bold text-base">Compiling Analytics...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout useSafeArea>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
        }
      >
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-2">
                <Ionicons name="arrow-back" size={24} color="#64748B" />
              </TouchableOpacity>
              <View>
                <Text className="text-2xl font-extrabold text-textDark tracking-tight">Analytics Overview</Text>
                <Text className="text-xs text-textMuted mt-1 font-semibold">{getGreeting(user?.fullName)}</Text>
              </View>
            </View>
            <AppButton 
              title="Export" 
              icon={<Ionicons name="document-text" size={16} color="#2563EB" />} 
              variant="secondary"
              className="py-2 px-4"
              textClassName="text-primary"
              onPress={generatePDFReport} 
            />
          </View>
        </View>

        <Text className="text-lg font-sans font-bold text-textDark mb-4 tracking-tight">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between mb-4">
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("Routes")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center">
              <Ionicons name="map" size={24} color="#2563EB" className="mb-2" />
              <Text className="text-xs font-sans text-textDark font-semibold">Routes</Text>
            </AppCard>
          </TouchableOpacity>
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("Buses")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center">
              <Ionicons name="bus" size={24} color="#4F46E5" className="mb-2" />
              <Text className="text-xs font-sans text-textDark font-semibold">Buses</Text>
            </AppCard>
          </TouchableOpacity>
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("ScheduleList")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center">
              <Ionicons name="calendar" size={24} color="#D97706" className="mb-2" />
              <Text className="text-xs font-sans text-textDark font-semibold">Schedules</Text>
            </AppCard>
          </TouchableOpacity>
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("BookingsTab")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center">
              <Ionicons name="receipt" size={24} color="#059669" className="mb-2" />
              <Text className="text-xs font-sans text-textDark font-semibold">Bookings</Text>
            </AppCard>
          </TouchableOpacity>
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("UserScheduleList")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center bg-slate-50 border-slate-200 border-dashed border-2">
              <Ionicons name="add-circle-outline" size={24} color="#64748B" className="mb-2" />
              <Text className="text-xs font-sans text-textMuted font-semibold">Book Ticket</Text>
            </AppCard>
          </TouchableOpacity>
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("DriverManagement")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center">
              <Ionicons name="people" size={24} color="#0891B2" className="mb-2" />
              <Text className="text-xs font-sans text-textDark font-semibold text-center">Manage Crew</Text>
            </AppCard>
          </TouchableOpacity>
          <TouchableOpacity className="w-[31%] mb-4" onPress={() => navigation.navigate("AdminNetworkMap")} activeOpacity={0.7}>
            <AppCard className="h-28 justify-center items-center bg-slate-50 border border-slate-200">
              <Ionicons name="analytics" size={24} color="#06B6D4" className="mb-2" />
              <Text className="text-xs font-sans text-textDark font-semibold text-center">Network Map</Text>
            </AppCard>
          </TouchableOpacity>
        </View>

        <AppCard className="mb-6">
          <Text className="text-sm font-sans font-bold text-textDark mb-3">Archival Date Filter</Text>
          <View className="flex-row justify-between items-center mb-1">
            <View className="w-[48%]">
              <Text className="text-[10px] text-textMuted mb-1 font-semibold uppercase">Start Date</Text>
              {Platform.OS === 'web' ? (
                <input 
                  type="date" 
                  style={{
                    border: "1px solid #E2E8F0",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#F8FAFC",
                    color: "#0F172A",
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
                  className="border border-border p-3 rounded-xl bg-background text-textDark text-sm font-sans"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
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
                    border: "1px solid #E2E8F0",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#F8FAFC",
                    color: "#0F172A",
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
                  className="border border-border p-3 rounded-xl bg-background text-textDark text-sm font-sans"
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              )}
            </View>
          </View>
          {(startDate || endDate) && (
            <TouchableOpacity className="items-center mt-4" onPress={() => { setStartDate(""); setEndDate(""); }}>
              <Text className="text-primary font-bold text-xs">Clear Filters (Show All Time)</Text>
            </TouchableOpacity>
          )}
        </AppCard>

        <Text className="text-lg font-sans font-bold text-textDark mb-4 tracking-tight">Performance Metrics</Text>
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] mb-4">
            <AppCard className="border-l-4 border-l-emerald-500 bg-white">
              <View className="flex-row items-center mb-2">
                <Ionicons name="wallet" size={16} color="#10B981" />
                <Text className="text-textMuted text-[10px] font-extrabold uppercase tracking-widest ml-2">Revenue</Text>
              </View>
              <Text className="text-textDark text-2xl font-sans font-black">
                <Text className="text-sm font-bold text-emerald-500 mr-1">LKR</Text>{metrics.totalRevenue.toLocaleString()}
              </Text>
            </AppCard>
          </View>

          <View className="w-[48%] mb-4">
            <AppCard className="border-l-4 border-l-blue-500 bg-white">
              <View className="flex-row items-center mb-2">
                <Ionicons name="ticket" size={16} color="#3B82F6" />
                <Text className="text-textMuted text-[10px] font-extrabold uppercase tracking-widest ml-2">Bookings</Text>
              </View>
              <Text className="text-textDark text-2xl font-sans font-black">{metrics.totalBookings}</Text>
            </AppCard>
          </View>

          <View className="w-[48%] mb-4">
            <AppCard className="border-l-4 border-l-cyan-500 bg-white">
              <View className="flex-row items-center mb-2">
                <Ionicons name="map" size={16} color="#06B6D4" />
                <Text className="text-textMuted text-[10px] font-extrabold uppercase tracking-widest ml-2">Routes</Text>
              </View>
              <Text className="text-textDark text-2xl font-sans font-black">{metrics.activeRoutes}</Text>
            </AppCard>
          </View>

          <View className="w-[48%] mb-4">
            <AppCard className="border-l-4 border-l-purple-500 bg-white">
              <View className="flex-row items-center mb-2">
                <Ionicons name="bus" size={16} color="#A855F7" />
                <Text className="text-textMuted text-[10px] font-extrabold uppercase tracking-widest ml-2">Buses</Text>
              </View>
              <Text className="text-textDark text-2xl font-sans font-black">{metrics.totalBuses}</Text>
            </AppCard>
          </View>
        </View>

        <AppCard className="mb-6 p-5">
          <Text className="text-sm font-sans font-bold text-textDark mb-4 tracking-tight">Booking Volume (7 Days Ending in Filter)</Text>
          <View className="flex-row justify-between items-end h-32 pt-2">
            {chartData.map((dataPoint, index) => (
              <View key={index} className="items-center flex-1">
                <Text className="text-[10px] font-bold text-primary mb-1 h-3">{dataPoint.count > 0 ? dataPoint.count : ""}</Text>
                <View className="w-6 h-20 bg-slate-100 rounded-t-sm justify-end overflow-hidden border border-slate-200">
                  <View
                    className="bg-primary w-full"
                    style={{ height: `${dataPoint.heightPercentage}%` }}
                  />
                </View>
                <Text className="text-[10px] text-textMuted font-sans font-semibold mt-2">{dataPoint.dayLabel}</Text>
              </View>
            ))}
          </View>
        </AppCard>

        <View className="flex-row flex-wrap justify-between mb-8">
          <View className="w-full md:w-[48%] mb-4 md:mb-0">
            <AppCard className="p-6 h-full">
              <Text className="text-base font-sans font-bold text-textDark mb-4 tracking-tight">Fleet Status</Text>
              <View className="mt-1">
                <View className="flex-row justify-between">
                  <View className="flex-row items-center mb-3">
                    <View className="w-4 h-4 rounded-full mr-3 bg-emerald-500" />
                    <Text className="text-sm font-semibold text-textDark">Available</Text>
                  </View>
                  <Text className="text-sm font-bold text-textMuted">{metrics.availableBuses}</Text>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-row items-center mb-3">
                    <View className="w-4 h-4 rounded-full mr-3 bg-amber-500" />
                    <Text className="text-sm font-semibold text-textDark">Maintenance</Text>
                  </View>
                  <Text className="text-sm font-bold text-textMuted">{metrics.maintenanceBuses}</Text>
                </View>

                <View className="flex-row h-4 rounded-full overflow-hidden bg-slate-100 mt-4">
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
            </AppCard>
          </View>

          <View className="w-full md:w-[48%]">
            <AppCard className="p-6 h-full">
              <Text className="text-base font-sans font-bold text-textDark mb-6 tracking-tight">Booking Status</Text>
              <View className="flex-row items-center justify-between px-2">
                <View className="items-center justify-center">
                  <DonutChart 
                    data={[
                      { color: "#10B981", value: metrics.statusCounts?.Confirmed || 0, percentage: (metrics.statusCounts?.Confirmed || 0) / (metrics.totalBookings || 1) },
                      { color: "#F59E0B", value: metrics.statusCounts?.Pending || 0, percentage: (metrics.statusCounts?.Pending || 0) / (metrics.totalBookings || 1) },
                      { color: "#EF4444", value: metrics.statusCounts?.Cancelled || 0, percentage: (metrics.statusCounts?.Cancelled || 0) / (metrics.totalBookings || 1) }
                    ]}
                    radius={45}
                    strokeWidth={18}
                  />
                </View>
                <View className="flex-1 ml-8 justify-center">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center"><View className="w-3 h-3 rounded-full mr-2.5 bg-emerald-500" /><Text className="text-xs font-bold text-textDark">Confirmed</Text></View>
                    <Text className="text-xs font-extrabold text-textMuted ml-4">{metrics.statusCounts?.Confirmed || 0}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center"><View className="w-3 h-3 rounded-full mr-2.5 bg-amber-500" /><Text className="text-xs font-bold text-textDark">Pending</Text></View>
                    <Text className="text-xs font-extrabold text-textMuted ml-4">{metrics.statusCounts?.Pending || 0}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center"><View className="w-3 h-3 rounded-full mr-2.5 bg-red-500" /><Text className="text-xs font-bold text-textDark">Cancelled</Text></View>
                    <Text className="text-xs font-extrabold text-textMuted ml-4">{metrics.statusCounts?.Cancelled || 0}</Text>
                  </View>
                </View>
              </View>
            </AppCard>
          </View>
        </View>

        {recentBookings.length > 0 && (
          <AppCard className="mb-10 p-0 overflow-hidden">
            <View className="p-5 border-b border-border bg-slate-50">
              <Text className="text-base font-sans font-extrabold text-textDark tracking-tight">Recent Bookings</Text>
            </View>
            <View className="p-2">
              {recentBookings.map((bk, index) => (
                <View key={bk._id || index} className={`flex-row justify-between items-center p-3 ${index !== recentBookings.length - 1 ? 'border-b border-border' : ''}`}>
                  <View className="flex-1 pr-2">
                    <Text className="text-textDark font-bold text-sm" numberOfLines={1}>{bk.scheduleId?.routeId?.routeName || bk.schedule?.route?.routeName || "Unknown Route"}</Text>
                    <Text className="text-textMuted text-xs font-medium mt-1">{new Date(bk.createdAt).toLocaleDateString()} • {bk.seats?.length || bk.seatNumbers?.length || 0} Seats</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-textDark font-black text-sm">LKR {bk.totalPrice}</Text>
                    <View className={`px-2 py-1 mt-1.5 rounded-full ${bk.status === 'Confirmed' ? 'bg-success-bg' : 'bg-warning-bg'}`}>
                      <Text className={`text-[9px] font-extrabold uppercase ${bk.status === 'Confirmed' ? 'text-success-text' : 'text-warning-text'}`}>{bk.status}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </AppCard>
        )}

      </ScrollView>
    </AppLayout>
  );
};

export default AdminDashboardScreen;
