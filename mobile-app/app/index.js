import React from "react";
import { AuthProvider } from "../context/AuthContext";
import AppNavigator from "../navigation/AppNavigator";

export default function Index() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}