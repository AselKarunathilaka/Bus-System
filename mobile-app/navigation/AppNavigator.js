import React, { useContext } from "react";
<<<<<<< HEAD
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
=======
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RouteListScreen from "../screens/RouteListScreen";
<<<<<<< HEAD
import RouteFormScreen from "../screens/RouteFormScreen";
import StopListScreen from "../screens/StopListScreen";
import StopFormScreen from "../screens/StopFormScreen";
import BusListScreen from "../screens/BusListScreen";
import BusFormScreen from "../screens/BusFormScreen";
=======
import AddRouteScreen from "../screens/AddRouteScreen";
import StopListScreen from "../screens/StopListScreen";
import AddStopScreen from "../screens/AddStopScreen";
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
<<<<<<< HEAD
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  return (
    <NavigationContainer>
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
    </NavigationContainer>
=======
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Routes" component={RouteListScreen} />
          <Stack.Screen name="AddRoute" component={AddRouteScreen} />
          <Stack.Screen name="StopList" component={StopListScreen} />
          <Stack.Screen name="AddStop" component={AddStopScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  );
};

export default AppNavigator;