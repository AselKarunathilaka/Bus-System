import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LiquidBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Light Minimal Gradient */}
      <LinearGradient
        colors={["#f5f5f7", "#ffffff", "#f5f5f7"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Very Subtle Ambient Orbs for Depth (Optional Apple-like glass depth) */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      {/* Foreground Content */}
      <View style={StyleSheet.absoluteFillObject}>{children}</View>
    </View>
  );
};

export default LiquidBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  orb1: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(220, 220, 230, 0.4)", // Very light subtle gray-blue
    transform: [{ scaleX: 1.2 }, { rotate: "45deg" }],
    filter: "blur(60px)",
  },
  orb2: {
    position: "absolute",
    bottom: -50,
    right: -100,
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: "rgba(230, 230, 240, 0.35)", // Subtle gray
    filter: "blur(80px)",
  },
  orb3: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(200, 210, 230, 0.2)", // Subtle cool gray
    filter: "blur(70px)",
  },
});
