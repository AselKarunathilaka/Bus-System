import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppButton from "../components/ui/AppButton";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const PaymentScreen = ({ route, navigation }) => {
  const { paymentDetails } = route.params;
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const { provider, amount, currency, paymentReference, customer, gatewayPayload } = paymentDetails;

  const handleMockSuccess = async () => {
    setLoading(true);
    try {
      await api.post(`/payments/mock/success/${paymentReference}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigation.navigate("PaymentSuccess", { paymentReference });
    } catch (error) {
      Alert.alert("Error", "Failed to process mock payment");
      setLoading(false);
    }
  };

  const handleMockFail = async () => {
    setLoading(true);
    try {
      await api.post(`/payments/mock/fail/${paymentReference}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigation.navigate("PaymentFailed", { paymentReference });
    } catch (error) {
      Alert.alert("Error", "Failed to process mock payment failure");
      setLoading(false);
    }
  };

  return (
    <AppLayout useSafeArea>
      <View className="flex-1 self-center w-full max-w-4xl p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Payment Portal</Text>
          </View>
        </View>

        <View className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-slate-100 max-w-md w-full self-center">
          <View className="items-center mb-8">
            <Ionicons name="card-outline" size={64} color="#2563EB" className="mb-4" />
            <Text className="text-3xl font-black text-textDark mb-1">
              {amount.toLocaleString()} <Text className="text-xl text-textMuted">{currency}</Text>
            </Text>
            <Text className="text-textMuted text-sm font-medium">Ref: {paymentReference}</Text>
          </View>

          <View className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
            <Text className="text-xs font-bold text-textMuted uppercase tracking-wider mb-2">Customer Details</Text>
            <Text className="text-textDark font-medium mb-1">{customer?.name}</Text>
            <Text className="text-textDark font-medium mb-1">{customer?.email}</Text>
            <Text className="text-textDark font-medium">{customer?.phone}</Text>
          </View>

          {provider === "mock" ? (
            <View>
              <Text className="text-center text-textMuted mb-6 font-medium">
                Testing mode is active. Choose an outcome below.
              </Text>
              
              <AppButton
                title={loading ? "Processing..." : "Test Payment Success"}
                onPress={handleMockSuccess}
                disabled={loading}
                className="mb-4 bg-emerald-600"
              />
              
              <AppButton
                title={loading ? "Processing..." : "Test Payment Fail"}
                onPress={handleMockFail}
                disabled={loading}
                variant="outline"
                textClassName="text-red-600"
                className="border-red-600"
              />
            </View>
          ) : (
            <View>
              <Text className="text-center text-textMuted mb-6 font-medium">
                PayHere integration will be rendered here.
              </Text>
              <AppButton
                title="Cancel Payment"
                onPress={() => navigation.navigate("MainTabs")}
                variant="outline"
              />
            </View>
          )}
        </View>
      </View>
    </AppLayout>
  );
};

export default PaymentScreen;
