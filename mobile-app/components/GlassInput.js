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

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-xs font-bold text-textDark uppercase mb-2 ml-1 tracking-wider">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-[rgba(255,255,255,0.35)] border rounded-2xl px-4 py-1
          ${isFocused ? "border-primary bg-[rgba(255,255,255,0.5)] shadow-sm shadow-primary/30" : "border-[rgba(255,255,255,0.55)]"}
          ${error ? "border-danger bg-danger" : ""}
        `}
        style={styles.container}
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
      </View>
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
