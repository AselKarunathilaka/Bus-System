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
        <Text className="text-xs font-bold text-slate-300 uppercase mb-2 ml-1 tracking-wider">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-white/10 border rounded-2xl px-4 py-1
          ${isFocused ? "border-[#38bdf8] bg-white/15 shadow-sm shadow-[#38bdf8]/30" : "border-white/10"}
          ${error ? "border-red-400 bg-red-400/10" : ""}
        `}
        style={styles.container}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#f87171" : isFocused ? "#38bdf8" : "#94a3b8"}
            className="mr-3"
          />
        )}
        <TextInput
          placeholderTextColor="#94a3b8"
          className={`flex-1 text-white font-semibold text-base py-3 h-14 ${className}`}
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
        <Text className="text-red-400 text-xs font-semibold mt-1.5 ml-1">
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
