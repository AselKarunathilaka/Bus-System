import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RouteListScreen from "../screens/RouteListScreen";
import RouteFormScreen from "../screens/RouteFormScreen";
import StopListScreen from "../screens/StopListScreen";
import StopFormScreen from "../screens/StopFormScreen";

// 1. Import your new screen
import ScheduleListScreen from "../screens/ScheduleListScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authToken ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Routes" component={RouteListScreen} />
            <Stack.Screen name="RouteForm" component={RouteFormScreen} />
            <Stack.Screen name="StopList" component={StopListScreen} />
            <Stack.Screen name="StopForm" component={StopFormScreen} />
            
            <Stack.Screen 
              name="ScheduleList" 
              component={ScheduleListScreen} 
              options={{ title: 'Manage Schedules' }} 
            />
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