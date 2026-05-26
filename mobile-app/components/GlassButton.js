import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const GlassButton = ({ title, onPress, className = "", textClassName = "", icon, variant = "primary", disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);
  const isSecondary = variant === "secondary" || variant === "glass";
  const isDanger = variant === "danger";

  let gradientColors = isPressed ? ["#1E88E5", "#2F80ED"] : ["#2F80ED", "#56CCF2"]; // primary
  if (isDanger) gradientColors = isPressed ? ["#e11d48", "#f43f5e"] : ["#f43f5e", "#fb7185"];
  
  const textColor = isSecondary ? "text-primary" : "text-white";

  return (
    <TouchableOpacity
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, !isSecondary && !disabled && styles.shadowPrimary]}
      className={`rounded-2xl overflow-hidden border ${isSecondary ? 'border-primary/50' : 'border-white/40'} ${disabled ? 'opacity-50' : ''} flex-1 ${className}`}
    >
      {isSecondary && (
        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} className={isPressed ? "bg-white/40" : "bg-white/20"} />
      )}
      {!isSecondary && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      
      {/* Inner top highlight */}
      {!isSecondary && (
        <View style={StyleSheet.absoluteFillObject} className="border-t border-white/40 rounded-2xl" />
      )}
      
      <View className={`px-6 py-4 flex-row items-center justify-center h-full`}>
        {icon && icon}
        <Text
          className={`font-bold text-lg tracking-wide ${icon ? "ml-2" : ""} ${textColor} ${textClassName}`}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GlassButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  shadowPrimary: {
    shadowColor: "rgba(47, 128, 237, 0.4)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  }
});
