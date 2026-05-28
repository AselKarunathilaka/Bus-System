import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STATUS_CONFIG = {
  active: {
    bg: "bg-success",
    border: "border-success",
    textClass: "text-green-700",
    iconColor: "#15803d", 
    icon: "checkmark-circle",
  },
  available: {
    bg: "bg-success",
    border: "border-success",
    textClass: "text-green-700",
    iconColor: "#15803d",
    icon: "checkmark-circle",
  },
  assigned: {
    bg: "bg-primary/20",
    border: "border-primary/30",
    textClass: "text-primary",
    iconColor: "#2F80ED",
    icon: "swap-horizontal",
  },
  booked: {
    bg: "bg-danger",
    border: "border-danger",
    textClass: "text-red-700",
    iconColor: "#b91c1c",
    icon: "close-circle",
  },
  inactive: {
    bg: "bg-danger",
    border: "border-danger",
    textClass: "text-red-700",
    iconColor: "#b91c1c",
    icon: "close-circle",
  },
  cancelled: {
    bg: "bg-danger",
    border: "border-danger",
    textClass: "text-red-700",
    iconColor: "#b91c1c",
    icon: "close-circle",
  },
  maintenance: {
    bg: "bg-warning",
    border: "border-warning",
    textClass: "text-amber-700",
    iconColor: "#b45309",
    icon: "build",
  },
  selected: {
    bg: "bg-warning",
    border: "border-warning",
    textClass: "text-amber-700",
    iconColor: "#b45309",
    icon: "checkmark-circle",
  },
  default: {
    bg: "bg-glassSurface",
    border: "border-glassBorder",
    textClass: "text-textMuted",
    iconColor: "#5C7185",
    icon: "information-circle",
  },
};

const StatusBadge = ({ status, className = "" }) => {
  const normalizedStatus = (status || "").toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.default;

  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-lg border ${config.bg} ${config.border} ${className}`}>
      <Ionicons name={config.icon} size={14} color={config.iconColor} style={{ marginRight: 4 }} />
      <Text className={`font-sans text-xs font-bold uppercase tracking-wider ${config.textClass}`}>
        {status}
      </Text>
    </View>
  );
};

export default StatusBadge;
