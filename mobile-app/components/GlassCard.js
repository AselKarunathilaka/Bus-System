import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "", style = {} }) => {
  return (
    <View style={styles.outerContainer}>
      <View
        style={[styles.container, style]}
        className={`rounded-3xl overflow-hidden border border-white/60 shadow-lg ${className}`}
      >
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={40}
            tint="light"
            style={StyleSheet.absoluteFillObject}
            className="bg-white/10"
          />
        ) : (
          <View 
            style={StyleSheet.absoluteFillObject} 
            className="bg-[rgba(255,255,255,0.85)]" 
          />
        )}
        
        {/* Strong top inner glow for glass edge effect */}
        <View style={StyleSheet.absoluteFillObject} className="border-t border-l border-white/20 rounded-3xl" />
        
        {/* Content wrapper with zIndex to stay above background on Android */}
        <View style={{ position: "relative", zIndex: 1 }} className={className.includes('p-') ? "" : "p-6"}>
          {children}
        </View>
      </View>
    </View>
  );
};

export default GlassCard;

const styles = StyleSheet.create({
  outerContainer: {
    shadowColor: "rgba(37, 99, 235, 0.12)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 5,
  },
  container: {
    backgroundColor: "transparent",
  },
});
