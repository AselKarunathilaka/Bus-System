import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const GlassButton = ({ title, onPress, className = "", textClassName = "", icon, variant = "primary", disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);
  const isSecondary = variant === "secondary" || variant === "glass";

  return (
    <TouchableOpacity
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
      className={`rounded-2xl overflow-hidden border ${isSecondary ? 'border-white/10' : 'border-white/20'} ${disabled ? 'opacity-50' : ''} flex-1 ${className}`}
    >
      {isSecondary && (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} className={isPressed ? "bg-white/10" : "bg-slate-800/40"} />
      )}
      {!isSecondary && (
        <LinearGradient
          colors={isPressed ? ["#0369a1", "#4338ca"] : ["#0ea5e9", "#6366f1"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      
      {/* Inner top highlight */}
      {!isSecondary && (
        <View style={StyleSheet.absoluteFillObject} className="border-t border-white/30 rounded-2xl" />
      )}
      
      <View className={`px-6 py-4 flex-row items-center justify-center h-full`}>
        {icon && icon}
        <Text
          className={`font-bold text-lg tracking-wide ${icon ? "ml-2" : ""} ${isSecondary ? "text-slate-200" : "text-white"} ${textClassName}`}
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
});
