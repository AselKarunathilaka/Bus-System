import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "" }) => {
  return (
    <View style={styles.container} className={`rounded-3xl overflow-hidden border border-black/5 ${className}`}>
      <BlurView
        intensity={Platform.OS === "ios" ? 40 : 40}
        tint="light"
        style={StyleSheet.absoluteFillObject}
        className="bg-white/60"
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
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
});
