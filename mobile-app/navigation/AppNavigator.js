import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

import RouteListScreen from "../screens/RouteListScreen";
import RouteFormScreen from "../screens/RouteFormScreen";
import AddRouteScreen from "../screens/AddRouteScreen";

import StopListScreen from "../screens/StopListScreen";
import StopFormScreen from "../screens/StopFormScreen";
import AddStopScreen from "../screens/AddStopScreen";

import BusListScreen from "../screens/BusListScreen";
import BusFormScreen from "../screens/BusFormScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, userToken, user, loading } = useContext(AuthContext);

  const authToken = token || userToken || user;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {authToken ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

          <Stack.Screen
            name="Routes"
            component={RouteListScreen}
            options={{ title: "Routes" }}
          />
          <Stack.Screen
            name="RouteForm"
            component={RouteFormScreen}
            options={{ title: "Route Form" }}
          />
          <Stack.Screen
            name="AddRoute"
            component={AddRouteScreen}
            options={{ title: "Add Route" }}
          />

          <Stack.Screen
            name="StopList"
            component={StopListScreen}
            options={{ title: "Stops" }}
          />
          <Stack.Screen
            name="StopForm"
            component={StopFormScreen}
            options={{ title: "Stop Form" }}
          />
          <Stack.Screen
            name="AddStop"
            component={AddStopScreen}
            options={{ title: "Add Stop" }}
          />

          <Stack.Screen
            name="BusList"
            component={BusListScreen}
            options={{ title: "Buses" }}
          />
          <Stack.Screen
            name="BusForm"
            component={BusFormScreen}
            options={{ title: "Bus Form" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;