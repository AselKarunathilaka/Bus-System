import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../context/AuthContext";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RouteListScreen from "../screens/RouteListScreen";
import RouteFormScreen from "../screens/RouteFormScreen";
import StopListScreen from "../screens/StopListScreen";
import StopFormScreen from "../screens/StopFormScreen";
import BusListScreen from "../screens/BusListScreen";
import BusFormScreen from "../screens/BusFormScreen";

import ScheduleListScreen from "../screens/ScheduleListScreen";
import ScheduleFormScreen from "../screens/ScheduleFormScreen";
import UserScheduleListScreen from "../screens/UserScheduleListScreen";
import SeatSelectionScreen from "../screens/SeatSelectionScreen";
import BookingConfirmationScreen from "../screens/BookingConfirmationScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import AdminBookingListScreen from "../screens/AdminBookingListScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import AdminGuideScreen from "../screens/AdminGuideScreen";
import UserGuideScreen from "../screens/UserGuideScreen";
import OffersScreen from "../screens/OffersScreen";
import TravelStatsScreen from "../screens/TravelStatsScreen";
import DriverManagementScreen from "../screens/DriverManagementScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import BookingGuideScreen from "../screens/BookingGuideScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentSuccessScreen from "../screens/PaymentSuccessScreen";
import PaymentFailedScreen from "../screens/PaymentFailedScreen";
import RouteMapOverviewScreen from "../screens/RouteMapOverviewScreen";
import AdminNetworkMapScreen from "../screens/AdminNetworkMapScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeTab") iconName = focused ? "home" : "home-outline";
          else if (route.name === "BookingsTab") iconName = focused ? "ticket" : "ticket-outline";
          else if (route.name === "ProfileTab") iconName = focused ? "person" : "person-outline";
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#06b6d4", // Cyan 500
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 14,
          height: 68,
          borderRadius: 24,
          backgroundColor: "rgba(15, 23, 42, 0.96)",
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.24,
          shadowRadius: 20,
          elevation: 12,
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen 
        name="BookingsTab" 
        component={isAdmin ? AdminBookingListScreen : MyBookingsScreen} 
        options={({ navigation }) => ({
          title: "Bookings",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#3567e0" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={({ navigation }) => ({
          title: "Profile",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#3567e0" />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { token, loading, user } = useContext(AuthContext);
  const authToken = token;
  const isAdmin = user?.role === "admin";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {loading ? (
        <Stack.Screen name="Loading" options={{ headerShown: false }}>
          {() => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F0F8FF" }}>
              <ActivityIndicator size="large" color="#2F80ED" />
            </View>
          )}
        </Stack.Screen>
      ) : authToken ? (
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="UserGuide" component={UserGuideScreen} options={{ title: "Help & Support" }} />
          <Stack.Screen name="Routes" component={RouteListScreen} />
          <Stack.Screen name="StopList" component={StopListScreen} />
          <Stack.Screen name="Buses" component={BusListScreen} />
          <Stack.Screen name="UserScheduleList" component={UserScheduleListScreen} />
          <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
          <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
          <Stack.Screen name="Offers" component={OffersScreen} options={{ title: "Offers & Deals" }} />
          <Stack.Screen name="TravelStats" component={TravelStatsScreen} options={{ title: "Travel Stats" }} />
          <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ title: "About Us" }} />
          <Stack.Screen name="BookingGuide" component={BookingGuideScreen} options={{ title: "How to Book" }} />
          <Stack.Screen name="ContactUs" component={ContactUsScreen} options={{ title: "Contact Us" }} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
          <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
          <Stack.Screen name="RouteMapOverview" component={RouteMapOverviewScreen} />
          {isAdmin && (
            <Stack.Group>
              <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: "Admin Dashboard" }} />
              <Stack.Screen name="AdminGuide" component={AdminGuideScreen} options={{ title: "Admin Guide" }} />
              <Stack.Screen name="RouteForm" component={RouteFormScreen} />
              <Stack.Screen name="StopForm" component={StopFormScreen} />
              <Stack.Screen name="BusForm" component={BusFormScreen} />
              <Stack.Screen name="ScheduleList" component={ScheduleListScreen} />
              <Stack.Screen name="ScheduleForm" component={ScheduleFormScreen} />
              <Stack.Screen name="AdminBookingList" component={AdminBookingListScreen} />
              <Stack.Screen name="DriverManagement" component={DriverManagementScreen} options={{ title: "Drivers" }} />
              <Stack.Screen name="AdminNetworkMap" component={AdminNetworkMapScreen} options={{ title: "Network Map" }} />
            </Stack.Group>
          )}
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
