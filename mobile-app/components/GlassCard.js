import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "", style = {} }) => {
  return (
    <View>
      <View
        style={[styles.container, style]}
        className={`rounded-3xl overflow-hidden border border-white/60 shadow-lg ${className}`}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 60}
          tint="light"
          style={StyleSheet.absoluteFillObject}
          className="bg-white/10"
        />
        {/* Strong top inner glow for glass edge effect */}
        <View style={StyleSheet.absoluteFillObject} className="border-t border-l border-white/20 rounded-3xl" />
        <View className={className.includes('p-') ? "" : "p-6"}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default GlassCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    shadowColor: "rgba(37, 99, 235, 0.12)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 5,
  },
});
