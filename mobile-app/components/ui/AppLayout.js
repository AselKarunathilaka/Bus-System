import React from "react";
import { View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const AppLayout = ({ children, className = "", style = {}, useSafeArea = false }) => {
  const Container = useSafeArea ? SafeAreaView : View;
  const layoutStyle = [
    { flex: 1 },
    Platform.OS === 'web' && { height: '100vh', display: 'flex', overflowY: 'auto', overflowX: 'hidden' },
    style
  ];

  return (
    <LinearGradient
      colors={["#F8FBFF", "#F5F3FF", "#ECFEFF"]}
      locations={[0, 0.52, 1]}
      style={{ flex: 1 }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: 140,
          backgroundColor: "rgba(59, 130, 246, 0.10)",
          top: -120,
          right: -100,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: 120,
          backgroundColor: "rgba(139, 92, 246, 0.08)",
          bottom: -110,
          left: -100,
        }}
      />
      <Container style={layoutStyle} className={className}>
        {children}
      </Container>
    </LinearGradient>
  );
};

export default AppLayout;
