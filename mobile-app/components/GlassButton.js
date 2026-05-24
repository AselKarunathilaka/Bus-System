import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlassButton = ({ title, onPress, className = "", textClassName = "", icon, variant = "primary" }) => {
  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isSecondary = variant === "secondary" || variant === "glass";

  return (
    <AnimatedPressable
      onPressIn={() => {
        setIsPressed(true);
        scale.value = withTiming(0.96, { duration: 100 });
      }}
      onPressOut={() => {
        setIsPressed(false);
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={onPress}
      style={[animatedStyle, styles.container]}
      className={`rounded-2xl overflow-hidden border ${isSecondary ? 'border-white/10' : 'border-[#007AFF]'} ${className}`}
    >
      {isSecondary && (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFillObject} className="bg-slate-800/50" />
      )}
      {!isSecondary && (
        <View style={StyleSheet.absoluteFillObject} className={isPressed ? "bg-[#005bb5]" : "bg-[#007AFF]"} />
      )}
      
      <View className={`px-6 py-4 flex-row items-center justify-center ${isSecondary && isPressed ? 'bg-white/10' : ''}`}>
        {icon && icon}
        <Text
          className={`font-semibold text-lg ${icon ? "ml-2" : ""} ${isSecondary ? "text-slate-200" : "text-white"} ${textClassName}`}
        >
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

export default GlassButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
});
