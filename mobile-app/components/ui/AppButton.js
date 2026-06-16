import React from "react";
import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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

  const content = (
    <>
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
    </>
  );

  const buttonStyle = [
    {
      minHeight: 52,
      shadowColor: variant === "primary" ? "#2563EB" : "#0F172A",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: variant === "primary" ? 0.2 : 0.06,
      shadowRadius: 14,
      elevation: variant === "primary" ? 4 : 1,
    },
    style,
    disabled || loading ? { opacity: 0.55 } : undefined,
  ];

  if (variant === "primary" && !(style && style.backgroundColor)) {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onPress}
        activeOpacity={0.85}
        style={buttonStyle}
        className={`rounded-2xl overflow-hidden ${className}`}
      >
        <LinearGradient
          colors={["#2563EB", "#4F46E5", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            minHeight: 52,
            paddingVertical: 14,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.8}
      style={buttonStyle}
      className={`flex-row items-center justify-center rounded-2xl py-3.5 px-6 border ${borderColor} ${bgColor} ${className}`}
    >
      <View className="flex-row items-center justify-center">{content}</View>
    </TouchableOpacity>
  );
};

export default AppButton;
