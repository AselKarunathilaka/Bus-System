import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LiquidBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Vibrant Gradient */}
      <LinearGradient
        colors={["#0f172a", "#1e1b4b", "#0f172a"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Vibrant Ambient Orbs for Depth */}
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
    backgroundColor: "#0f172a", // Fallback color
  },
  orb1: {
    position: "absolute",
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(56, 189, 248, 0.45)", // Bright Cyan
    transform: [{ scaleX: 1.2 }, { rotate: "45deg" }],
    filter: "blur(90px)",
  },
  orb2: {
    position: "absolute",
    bottom: -height * 0.05,
    right: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "rgba(139, 92, 246, 0.45)", // Vibrant Purple
    filter: "blur(110px)",
  },
  orb3: {
    position: "absolute",
    top: height * 0.2,
    left: width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "rgba(236, 72, 153, 0.35)", // Soft Pink
    filter: "blur(100px)",
  },
});
