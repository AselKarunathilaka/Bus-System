import React, { useState } from "react";
import { View, TextInput, Text, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  const borderColor = error ? "#EF4444" : isFocused ? "#2563EB" : "rgba(255, 255, 255, 0.55)";
  const backgroundColor = error ? "rgba(239, 68, 68, 0.4)" : isFocused ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.35)";

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-xs font-bold font-sans text-white uppercase mb-2 ml-1 tracking-wider">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-3xl px-4 py-1 shadow-sm ${error ? "shadow-red-500/30" : isFocused ? "shadow-primary/30" : "shadow-transparent"}`}
        style={[
          styles.container,
          { borderColor, backgroundColor }
        ]}
      >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={error ? "#EF4444" : isFocused ? "#2563EB" : "#5C7185"}
              className="mr-3"
            />
          )}
          <TextInput
            placeholderTextColor="#64748B"
            className={`flex-1 text-textDark font-sans font-semibold text-base py-3 h-14 ${className}`}
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
      </View>
      {error && (
        <Text className="text-red-500 font-sans text-xs font-semibold mt-1.5 ml-1">
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
