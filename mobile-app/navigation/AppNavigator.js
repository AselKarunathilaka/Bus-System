import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../context/AuthContext";
import { TouchableOpacity } from "react-native";
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
        tabBarActiveTintColor: "#38bdf8",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b'
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
            <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} style={{ marginLeft: 15 }}>
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
            <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} style={{ marginLeft: 15 }}>
              <Ionicons name="arrow-back" size={24} color="#3567e0" />
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authToken ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: "Admin Dashboard" }} />
            <Stack.Screen name="Routes" component={RouteListScreen} />
            <Stack.Screen name="RouteForm" component={RouteFormScreen} />
            <Stack.Screen name="StopList" component={StopListScreen} />
            <Stack.Screen name="StopForm" component={StopFormScreen} />
            <Stack.Screen name="Buses" component={BusListScreen} />
            <Stack.Screen name="BusForm" component={BusFormScreen} />
            
            <Stack.Screen name="ScheduleList" component={ScheduleListScreen} />
            <Stack.Screen name="ScheduleForm" component={ScheduleFormScreen} />
            <Stack.Screen name="UserScheduleList" component={UserScheduleListScreen} />
            <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;