import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STATUS_CONFIG = {
  active: { bg: "bg-success-bg", textClass: "text-success-text", iconColor: "#15803D", icon: "checkmark-circle" },
  available: { bg: "bg-success-bg", textClass: "text-success-text", iconColor: "#15803D", icon: "checkmark-circle" },
  assigned: { bg: "bg-primary-light/20", textClass: "text-primary-dark", iconColor: "#1D4ED8", icon: "swap-horizontal" },
  booked: { bg: "bg-danger-bg", textClass: "text-danger-text", iconColor: "#B91C1C", icon: "close-circle" },
  inactive: { bg: "bg-danger-bg", textClass: "text-danger-text", iconColor: "#B91C1C", icon: "close-circle" },
  cancelled: { bg: "bg-danger-bg", textClass: "text-danger-text", iconColor: "#B91C1C", icon: "close-circle" },
  maintenance: { bg: "bg-warning-bg", textClass: "text-warning-text", iconColor: "#B45309", icon: "build" },
  selected: { bg: "bg-warning-bg", textClass: "text-warning-text", iconColor: "#B45309", icon: "checkmark-circle" },
  default: { bg: "bg-slate-100", textClass: "text-slate-600", iconColor: "#475569", icon: "information-circle" },
};

const AppBadge = ({ status, className = "" }) => {
  const normalizedStatus = (status || "").toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.default;

  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-full ${config.bg} ${className}`}>
      <Ionicons name={config.icon} size={14} color={config.iconColor} style={{ marginRight: 4 }} />
      <Text className={`font-sans text-xs font-bold uppercase tracking-wide ${config.textClass}`}>
        {status}
      </Text>
    </View>
  );
};

export default AppBadge;
