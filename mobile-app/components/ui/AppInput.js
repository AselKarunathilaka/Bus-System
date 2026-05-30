import React, { useState } from "react";
import { View, TextInput, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AppInput = ({
  icon,
  label,
  error,
  containerClassName = "",
  className = "",
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? "border-danger"
    : isFocused
    ? "border-primary"
    : "border-border";

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-sans font-semibold text-textDark mb-1.5 ml-1">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-xl px-4 py-1 bg-surface ${borderColor} ${
          isFocused ? "shadow-sm shadow-primary/10" : ""
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#EF4444" : isFocused ? "#2563EB" : "#64748B"}
            className="mr-3"
          />
        )}
        <TextInput
          placeholderTextColor="#94A3B8"
          className={`flex-1 text-textDark font-sans font-medium text-base py-3 h-14 ${className}`}
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
        <Text className="text-danger font-sans text-xs font-semibold mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default AppInput;
