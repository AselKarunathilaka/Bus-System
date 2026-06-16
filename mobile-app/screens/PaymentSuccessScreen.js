import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppButton from "../components/ui/AppButton";

const PaymentSuccessScreen = ({ navigation }) => {
  return (
    <AppLayout useSafeArea>
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-emerald-50 rounded-full w-24 h-24 items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        </View>
        
        <Text className="text-3xl font-black text-textDark mb-2 text-center">Payment Successful</Text>
        <Text className="text-textMuted text-center mb-10 px-4">
          Your booking has been confirmed and your digital ticket is ready.
        </Text>
        
        <View className="w-full max-w-sm">
          <AppButton
            title="View My Ticket"
            onPress={() => navigation.navigate("MainTabs", { screen: "BookingsTab" })}
            className="mb-4"
          />
          <AppButton
            title="Back to Home"
            onPress={() => navigation.navigate("MainTabs", { screen: "HomeTab" })}
            variant="outline"
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default PaymentSuccessScreen;
