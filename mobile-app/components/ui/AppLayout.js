import React from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = ({ children, className = "", style = {}, useSafeArea = false }) => {
  const layoutStyle = [
    { flex: 1 },
    Platform.OS === 'web' && { height: '100vh', display: 'flex', overflowY: 'auto', overflowX: 'hidden' },
    style
  ];

  if (useSafeArea) {
    return (
      <SafeAreaView style={layoutStyle} className={`bg-background ${className}`}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <View style={layoutStyle} className={`bg-background ${className}`}>
      {children}
    </View>
  );
};

export default AppLayout;
