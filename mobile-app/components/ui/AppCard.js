import React from "react";
import { View } from "react-native";

const AppCard = ({ children, className = "", style = {} }) => {
  return (
    <View
      className={`bg-surface rounded-3xl p-6 border ${className}`}
      style={[
        {
          borderColor: "rgba(226, 232, 240, 0.5)", // border-slate-200 / 50
          shadowColor: "#e2e8f0", // shadow-slate-200
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

export default AppCard;
