import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const STATUS_CONFIG = {
  active: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    textClass: "text-emerald-400",
    iconColor: "#34d399", // emerald-400
    icon: "checkmark-circle",
  },
  available: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    textClass: "text-emerald-400",
    iconColor: "#34d399",
    icon: "checkmark-circle",
  },
  assigned: {
    bg: "bg-[#0ea5e9]/20",
    border: "border-[#0ea5e9]/30",
    textClass: "text-[#38bdf8]",
    iconColor: "#38bdf8",
    icon: "swap-horizontal",
  },
  booked: {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    textClass: "text-red-400",
    iconColor: "#f87171",
    icon: "close-circle",
  },
  inactive: {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    textClass: "text-red-400",
    iconColor: "#f87171",
    icon: "close-circle",
  },
  cancelled: {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    textClass: "text-red-400",
    iconColor: "#f87171",
    icon: "close-circle",
  },
  maintenance: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    textClass: "text-amber-400",
    iconColor: "#fbbf24",
    icon: "build",
  },
  selected: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    textClass: "text-amber-400",
    iconColor: "#fbbf24",
    icon: "checkmark-circle",
  },
  default: {
    bg: "bg-white/10",
    border: "border-white/20",
    textClass: "text-slate-300",
    iconColor: "#cbd5e1",
    icon: "information-circle",
  },
};

const StatusBadge = ({ status, className = "" }) => {
  const normalizedStatus = (status || "").toLowerCase();
  const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.default;

  return (
    <View className={`flex-row items-center px-2.5 py-1 rounded-lg border ${config.bg} ${config.border} ${className}`}>
      <Ionicons name={config.icon} size={14} color={config.iconColor} style={{ marginRight: 4 }} />
      <Text className={`text-xs font-bold uppercase tracking-wider ${config.textClass}`}>
        {status}
      </Text>
    </View>
  );
};

export default StatusBadge;
