import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "", style = {} }) => {
  return (
    <View 
      style={[styles.container, style]}
      className={`rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.45)] shadow-xl ${className}`}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 70 : 100}
        tint="default"
        style={StyleSheet.absoluteFillObject}
        className="bg-white/25"
      />
      {/* Strong top inner glow for glass edge effect */}
      <View style={StyleSheet.absoluteFillObject} className="border-t-2 border-l border-white/40 rounded-3xl" />
      <View className={className.includes('p-') ? "" : "p-6"}>
        {children}
      </View>
    </View>
  );
};

export default GlassCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    shadowColor: "rgba(31, 120, 180, 0.16)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
  },
});
