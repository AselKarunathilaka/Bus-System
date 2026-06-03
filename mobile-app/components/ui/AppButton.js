import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

const AppButton = ({
  title,
  onPress,
  className = "",
  textClassName = "",
  icon,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  let bgColor = "bg-primary";
  let borderColor = "border-primary";
  let textColor = "text-white";

  if (variant === "secondary" || variant === "glass") {
    bgColor = "bg-white";
    borderColor = "border-border";
    textColor = "text-textDark";
  } else if (variant === "ghost") {
    bgColor = "bg-transparent";
    borderColor = "border-transparent";
    textColor = "text-primary";
  } else if (variant === "danger") {
    bgColor = "bg-danger";
    borderColor = "border-danger";
    textColor = "text-white";
  }

  // Override if custom style provided
  if (style && style.backgroundColor) {
    bgColor = "";
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.8}
      style={[style, disabled ? { opacity: 0.5 } : undefined]}
      className={`flex-row items-center justify-center rounded-xl py-3.5 px-6 border ${borderColor} ${bgColor} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={textColor === "text-white" ? "#fff" : "#2563EB"} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text
            className={`font-sans font-bold text-base ${textColor} ${
              icon ? "ml-2" : ""
            } ${textClassName}`}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
