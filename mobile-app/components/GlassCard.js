import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "", style = {} }) => {
  return (
    <View style={[styles.container, style]} className={`rounded-3xl overflow-hidden border border-white/20 shadow-lg ${className}`}>
      <BlurView
        intensity={Platform.OS === "ios" ? 50 : 80}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
        className="bg-slate-900/40"
      />
      {/* Subtle top inner glow for glass effect */}
      <View style={StyleSheet.absoluteFillObject} className="border-t border-white/10 rounded-3xl" />
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
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
});
