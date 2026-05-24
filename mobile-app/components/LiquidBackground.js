import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LiquidBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Dark Space Gradient */}
      <LinearGradient
        colors={["#0a0a2a", "#1a1a4a", "#2a0a4a"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Floating Organic Orbs for Liquid Effect */}
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
    backgroundColor: "#0a0a2a",
  },
  orb1: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(0, 255, 255, 0.4)", // Vibrant Cyan
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
    backgroundColor: "rgba(255, 0, 255, 0.35)", // Vibrant Magenta
    filter: "blur(80px)",
  },
  orb3: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(138, 43, 226, 0.3)", // Vibrant Blue Violet
    filter: "blur(70px)",
  },
});
