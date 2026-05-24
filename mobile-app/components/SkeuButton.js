import React, { useState } from "react";
import { Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SkeuButton = ({ title, onPress, className = "", textClassName = "", icon }) => {
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
        scale.value = withTiming(0.97, { duration: 100 });
      }}
      onPressOut={() => {
        setIsPressed(false);
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={onPress}
      style={animatedStyle}
      className={`
        rounded-2xl px-6 py-4 flex-row items-center justify-center
        ${isPressed ? "bg-[#d1d8e0] shadow-neo-inner" : "bg-background shadow-neo-light"}
        ${className}
      `}
    >
      {icon && icon}
      <Text
        className={`font-bold text-slate-700 text-lg ${icon ? "ml-2" : ""} ${textClassName}`}
      >
        {title}
      </Text>
    </AnimatedPressable>
  );
};

export default SkeuButton;
