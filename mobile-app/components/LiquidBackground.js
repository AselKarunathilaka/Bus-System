import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LiquidBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Dark Liquid Gradient */}
      <LinearGradient
        colors={["#0f172a", "#020617", "#0f172a"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Subtle Ambient Orbs for Depth */}
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
    backgroundColor: "#020617",
  },
  orb1: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(56, 189, 248, 0.15)", // Subtle light blue
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
    backgroundColor: "rgba(139, 92, 246, 0.15)", // Subtle purple
    filter: "blur(80px)",
  },
  orb3: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(14, 165, 233, 0.1)", // Subtle cyan
    filter: "blur(70px)",
  },
});
