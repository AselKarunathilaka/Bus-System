import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlassButton = ({ title, onPress, className = "", textClassName = "", icon, variant = "primary", disabled = false }) => {
  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isSecondary = variant === "secondary" || variant === "glass";

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled}
        onPressIn={() => {
          setIsPressed(true);
          scale.value = withTiming(0.96, { duration: 100 });
        }}
        onPressOut={() => {
          setIsPressed(false);
          scale.value = withTiming(1, { duration: 150 });
        }}
        onPress={onPress}
        style={styles.container}
        className={`rounded-2xl overflow-hidden border ${isSecondary ? 'border-white/10' : 'border-white/20'} ${disabled ? 'opacity-50' : ''} ${className}`}
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
        
        <View className={`px-6 py-4 flex-row items-center justify-center`}>
          {icon && icon}
          <Text
            className={`font-bold text-lg tracking-wide ${icon ? "ml-2" : ""} ${isSecondary ? "text-slate-200" : "text-white"} ${textClassName}`}
          >
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default GlassButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
});
