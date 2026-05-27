import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform, Animated } from "react-native";
import { BlurView } from "expo-blur";

const GlassCard = ({ children, className = "", style = {} }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      })
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View 
      style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
    >
      <View
        style={[styles.container, style]}
        className={`rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.6)] shadow-2xl ${className}`}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 70 : 100}
          tint="default"
          style={StyleSheet.absoluteFillObject}
          className="bg-white/40"
        />
        {/* Strong top inner glow for glass edge effect */}
        <View style={StyleSheet.absoluteFillObject} className="border-t-2 border-l border-white/60 rounded-3xl" />
        <View className={className.includes('p-') ? "" : "p-6"}>
          {children}
        </View>
      </View>
    </Animated.View>
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
