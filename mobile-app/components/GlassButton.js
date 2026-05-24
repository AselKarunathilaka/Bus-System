import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GlassButton = ({ title, onPress, className = "", textClassName = "", icon }) => {
  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      onPressIn={() => {
        setIsPressed(true);
        scale.value = withTiming(0.95, { duration: 100 });
      }}
      onPressOut={() => {
        setIsPressed(false);
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={onPress}
      style={[animatedStyle, styles.container]}
      className={`rounded-2xl overflow-hidden border border-white/30 ${className}`}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 50 : 100}
        tint={isPressed ? "default" : "light"}
        style={StyleSheet.absoluteFillObject}
        className={isPressed ? "bg-white/30" : "bg-white/10"}
      />
      <View className="px-6 py-4 flex-row items-center justify-center">
        {icon && icon}
        <Text
          className={`font-bold text-white text-lg ${icon ? "ml-2" : ""} ${textClassName}`}
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
});
