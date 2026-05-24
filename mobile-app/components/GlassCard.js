import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "" }) => {
  return (
    <View style={styles.container} className={`rounded-3xl overflow-hidden border border-white/10 ${className}`}>
      <BlurView
        intensity={Platform.OS === "ios" ? 40 : 60}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
        className="bg-slate-900/40"
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
  },
});
