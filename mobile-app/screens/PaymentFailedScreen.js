import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppButton from "../components/ui/AppButton";

const PaymentFailedScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-red-50 rounded-full w-24 h-24 items-center justify-center mb-6">
          <Ionicons name="close-circle" size={80} color="#EF4444" />
        </View>
        
        <Text className="text-3xl font-black text-textDark mb-2 text-center">Payment Failed</Text>
        <Text className="text-textMuted text-center mb-10 px-4">
          We couldn't process your payment. Your reserved seats have been released.
        </Text>
        
        <View className="w-full max-w-sm">
          <AppButton
            title="Try Booking Again"
            onPress={() => navigation.navigate("MainTabs", { screen: "HomeTab" })}
            className="mb-4 bg-red-600"
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default PaymentFailedScreen;
