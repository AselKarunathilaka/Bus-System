import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LiquidBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Deep Purple/Blue Gradient */}
      <LinearGradient
        colors={["#1e1b4b", "#312e81", "#1e3a8a", "#0f172a"]}
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
    backgroundColor: "#0f172a",
  },
  orb1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(139, 92, 246, 0.4)", // Violet
    transform: [{ scaleX: 1.2 }, { rotate: "45deg" }],
    filter: "blur(40px)",
  },
  orb2: {
    position: "absolute",
    bottom: 100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(59, 130, 246, 0.3)", // Blue
    filter: "blur(60px)",
  },
  orb3: {
    position: "absolute",
    top: "40%",
    left: "20%",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(236, 72, 153, 0.2)", // Pink
    filter: "blur(50px)",
  },
});
