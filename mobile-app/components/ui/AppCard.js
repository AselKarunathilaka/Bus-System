import React from "react";
import { View } from "react-native";

const AppCard = ({ children, className = "", style = {} }) => {
  return (
    <View
      className={`bg-surface rounded-3xl p-6 border ${className}`}
      style={[
        {
          borderColor: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          shadowColor: "#334155",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.08,
          shadowRadius: 22,
          elevation: 4
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

export default AppCard;
