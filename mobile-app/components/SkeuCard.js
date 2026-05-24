import React from "react";
import { View } from "react-native";

const SkeuCard = ({ children, className = "", inner = false }) => {
  return (
    <View
      className={`
        rounded-3xl p-6
        ${inner ? "bg-[#d1d8e0] shadow-neo-inner" : "bg-background shadow-neo-light"}
        ${className}
      `}
    >
      {children}
    </View>
  );
};

export default SkeuCard;
