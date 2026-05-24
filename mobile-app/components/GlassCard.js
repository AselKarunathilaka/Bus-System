import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "" }) => {
  return (
    <View style={styles.container} className={`rounded-3xl overflow-hidden border border-white/20 ${className}`}>
      <BlurView
        intensity={Platform.OS === "ios" ? 40 : 100}
        tint="light"
        style={StyleSheet.absoluteFillObject}
        className="bg-white/10"
      />
      <View className="p-6">
        {children}
      </View>
    </View>
  );
};

export default GlassCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
});
