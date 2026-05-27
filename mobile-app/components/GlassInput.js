import React, { useState, useEffect } from "react";
import { View, TextInput, Text, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";

const GlassInput = ({
  icon,
  label,
  error,
  containerClassName = "",
  className = "",
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = error 
      ? "#f87171" 
      : interpolateColor(focusAnim.value, [0, 1], ["rgba(255, 255, 255, 0.55)", "#2F80ED"]);

    const backgroundColor = error 
      ? "rgba(252, 165, 165, 0.4)" 
      : interpolateColor(focusAnim.value, [0, 1], ["rgba(255, 255, 255, 0.35)", "rgba(255, 255, 255, 0.5)"]);

    const scale = 1 + (focusAnim.value * 0.02);

    return {
      borderColor,
      backgroundColor,
      transform: [{ scale }]
    };
  });

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-xs font-bold text-textDark uppercase mb-2 ml-1 tracking-wider">
          {label}
        </Text>
      )}
      <Animated.View
        className={`flex-row items-center border rounded-3xl px-4 py-1 shadow-sm transition-colors ${error ? "shadow-red-500/30" : isFocused ? "shadow-primary/30" : "shadow-transparent"}`}
        style={[
          styles.container,
          animatedStyle
        ]}
      >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={error ? "#f87171" : isFocused ? "#2F80ED" : "#5C7185"}
              className="mr-3"
            />
          )}
          <TextInput
            placeholderTextColor="#5C7185"
            className={`flex-1 text-textDark font-semibold text-base py-3 h-14 ${className}`}
            style={[Platform.OS === "web" ? { outlineStyle: "none" } : {}, style]}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus && props.onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur && props.onBlur(e);
            }}
            {...props}
          />
      </Animated.View>
      {error && (
        <Text className="text-red-500 text-xs font-semibold mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default GlassInput;

const styles = StyleSheet.create({
  container: {
    backdropFilter: "blur(10px)",
  },
});
