import React from "react";
import { View } from "react-native";

const AppCard = ({ children, className = "", style = {} }) => {
  return (
    <View
      style={style}
      className={`bg-surface rounded-2xl border border-border shadow-sm p-5 ${className}`}
    >
      {children}
    </View>
  );
};

export default AppCard;
