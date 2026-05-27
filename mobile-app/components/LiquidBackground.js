import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Easing, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LiquidBackground = ({ children }) => {
  const isWeb = Platform.OS === "web";
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isWeb) {
      Animated.loop(
        Animated.timing(animValue, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [animValue, isWeb]);

  // Mobile-only animations
  const orb1Style = isWeb ? {} : {
    transform: [
      { translateX: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 40, 0] }) },
      { translateY: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -30, 0] }) },
      { scale: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.15, 1] }) },
      { rotate: animValue.interpolate({ inputRange: [0, 1], outputRange: ["45deg", "405deg"] }) },
    ]
  };

  const orb2Style = isWeb ? {} : {
    transform: [
      { translateX: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -50, 0] }) },
      { translateY: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 40, 0] }) },
      { scale: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.1, 1] }) },
    ]
  };

  const orb3Style = isWeb ? {} : {
    transform: [
      { translateX: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 30, 0] }) },
      { translateY: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 50, 0] }) },
      { scale: animValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] }) },
    ]
  };

  const AnimatedOrView = isWeb ? View : Animated.View;

  return (
    <View style={styles.container}>
      {/* Deep, Rich Vibrant Gradient for High Contrast */}
      <LinearGradient
        colors={["#0D47A1", "#1976D2", "#4FC3F7"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Vibrant Ambient Orbs for Depth */}
      <AnimatedOrView 
        style={[styles.orb1, orb1Style]} 
        className={isWeb ? "animate-orb1" : ""}
      />
      <AnimatedOrView 
        style={[styles.orb2, orb2Style]} 
        className={isWeb ? "animate-orb2" : ""}
      />
      <AnimatedOrView 
        style={[styles.orb3, orb3Style]} 
        className={isWeb ? "animate-orb3" : ""}
      />

      {/* Foreground Content */}
      <View style={StyleSheet.absoluteFillObject}>{children}</View>
    </View>
  );
};

export default LiquidBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D47A1", // Fallback deep blue
  },
  orb1: {
    position: "absolute",
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(0, 188, 212, 0.6)", // Bright Cyan
    filter: "blur(90px)",
    ...(Platform.OS === "web" && { transform: "rotate(45deg)" }), // Initial rotation for web
  },
  orb2: {
    position: "absolute",
    bottom: -height * 0.05,
    right: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "rgba(25, 118, 210, 0.5)", // Deep Blue
    filter: "blur(110px)",
  },
  orb3: {
    position: "absolute",
    top: height * 0.2,
    left: width * 0.1,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "rgba(100, 181, 246, 0.7)", // Light Blue
    filter: "blur(100px)",
  },
});
