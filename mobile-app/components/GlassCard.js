import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "", style = {} }) => {
  return (
    <View 
      style={[styles.container, style]}
      className={`rounded-3xl overflow-hidden border border-white/20 shadow-xl ${className}`}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 70 : 100}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
        className="bg-white/5"
      />
      {/* Strong top inner glow for glass edge effect */}
      <View style={StyleSheet.absoluteFillObject} className="border-t-2 border-l border-white/30 rounded-3xl" />
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
