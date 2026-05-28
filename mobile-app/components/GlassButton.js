import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { BlurView } from "expo-blur";

const GlassButton = ({ title, onPress, className = "", textClassName = "", icon, variant = "primary", disabled = false, style }) => {
  const isSecondary = variant === "secondary" || variant === "glass";
  const isDanger = variant === "danger";

  // Solid strong colors for professional look
  let bgColor = "bg-blue-600"; 
  let borderColor = "border-blue-700";
  let textColor = "text-white";

  if (isDanger) {
    bgColor = "bg-red-600";
    borderColor = "border-red-700";
  } else if (isSecondary) {
    bgColor = "bg-[rgba(255,255,255,0.4)]";
    borderColor = "border-[rgba(255,255,255,0.5)]";
    textColor = "text-[#0F172A]"; // Deep navy for text on glass
  }

  // If a custom style with backgroundColor is passed, remove the tailwind bg class to prevent conflict
  if (style && style.backgroundColor) {
    bgColor = "";
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, !isSecondary && !disabled && styles.shadowPrimary, style]}
      className={`rounded-full overflow-hidden border ${borderColor} ${bgColor} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {isSecondary && (
        Platform.OS === "ios" ? (
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} className="bg-white/20" />
        ) : (
          <View style={StyleSheet.absoluteFillObject} className="bg-[rgba(255,255,255,0.8)]" />
        )
      )}
      
      {!isSecondary && (
        <View style={StyleSheet.absoluteFillObject} className="border-t border-white/30 rounded-full" />
      )}
      
      <View style={{ position: "relative", zIndex: 1 }} className={`px-6 py-4 flex-row items-center justify-center`}>
        {icon && icon}
        <Text
          className={`font-sans font-bold text-lg tracking-wide ${icon ? "ml-2" : ""} ${textColor} ${textClassName}`}
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
    shadowColor: "rgba(37, 99, 235, 0.4)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  }
});
