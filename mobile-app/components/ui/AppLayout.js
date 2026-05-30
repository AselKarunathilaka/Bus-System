import React from "react";
import { View, SafeAreaView, Platform } from "react-native";

const AppLayout = ({ children, className = "", style = {}, useSafeArea = false }) => {
  const Wrapper = useSafeArea ? SafeAreaView : View;

  return (
    <Wrapper
      style={[
        { flex: 1 },
        Platform.OS === 'web' && { height: '100vh', display: 'flex', overflowY: 'auto', overflowX: 'hidden' },
        style
      ]}
      className={`bg-background ${className}`}
    >
      {children}
    </Wrapper>
  );
};

export default AppLayout;
