import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
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
        scale.value = withTiming(0.96, { duration: 100 });
      }}
      onPressOut={() => {
        setIsPressed(false);
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={onPress}
      style={[animatedStyle, styles.container]}
      className={`rounded-2xl overflow-hidden ${isPressed ? "bg-[#005bb5]" : "bg-[#007AFF]"} ${className}`}
    >
      <View className="px-6 py-4 flex-row items-center justify-center">
        {icon && icon}
        <Text
          className={`font-semibold text-white text-lg ${icon ? "ml-2" : ""} ${textClassName}`}
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
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
});
