import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LiquidBackground = ({ children }) => {
  const isWeb = Platform.OS === "web";
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim1, {
        toValue: 1,
        duration: 35000,
        useNativeDriver: false,
      })
    ).start();

    Animated.loop(
      Animated.timing(waveAnim2, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: false,
      })
    ).start();
  }, [waveAnim1, waveAnim2]);

  // Create an animated path that morphs or just moves horizontally
  const translateX1 = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  const translateX2 = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  // Base wave path string that repeats to allow smooth scrolling
  // This draws a wave that covers 2 * width, so we can translate from 0 to -width
  const wavePath1 = `M0,0 Q${width * 0.25},40 ${width * 0.5},0 T${width},0 Q${width * 1.25},40 ${width * 1.5},0 T${width * 2},0 V${height} H0 Z`;
  const wavePath2 = `M0,20 Q${width * 0.25},-20 ${width * 0.5},20 T${width},20 Q${width * 1.25},-20 ${width * 1.5},20 T${width * 2},20 V${height} H0 Z`;

  return (
    <View style={styles.container}>
      {/* Base Dark Navy Theme */}
      <LinearGradient 
        colors={["#042436", "#062B3A"]} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      {/* Background SVG Waves at bottom */}
      <View style={styles.waveContainer}>
        <Svg width={width * 2} height={height * 0.4} viewBox={`0 0 ${width * 2} ${height * 0.4}`}>
          <Defs>
            <SvgLinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.10" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" />
            </SvgLinearGradient>
            <SvgLinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#2563EB" stopOpacity="0.12" />
            </SvgLinearGradient>
          </Defs>
          
          <AnimatedPath
            d={wavePath1}
            fill="url(#grad1)"
            transform={[{ translateX: translateX1 }]}
          />
          <AnimatedPath
            d={wavePath2}
            fill="url(#grad2)"
            transform={[{ translateX: translateX2 }]}
          />
        </Svg>
      </View>
      
      {/* Foreground Content with SafeArea */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={isWeb ? styles.webContainer : styles.mobileContainer}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LiquidBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#042436",
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 2,
    height: height * 0.4,
    opacity: 0.8,
  },
  safeArea: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    alignSelf: "center",
    maxHeight: "100vh",
    overflow: 'hidden',
  },
  mobileContainer: {
    flex: 1,
  }
});
