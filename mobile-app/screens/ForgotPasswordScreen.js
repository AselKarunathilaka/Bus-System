import React, { useState } from "react";
import {
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import AppLayout from "../components/ui/AppLayout";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    // TODO: Connect this to the backend /auth/forgot-password route
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Reset Link Sent", 
        "If an account exists with this email, a password reset link has been sent.",
        [{ text: "Back to Login", onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const content = (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center", alignItems: Platform.OS === 'web' ? 'center' : 'stretch' }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className={Platform.OS === 'web' ? "w-full max-w-md" : ""}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mb-8 flex-row items-center self-start"
        >
          <Ionicons name="arrow-back" size={20} color="#64748B" />
          <Text className="text-textMuted font-medium ml-2">Back to Login</Text>
        </TouchableOpacity>

        <View className="mb-8 items-center">
          <View 
            className="px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
          >
            <Text className="text-primary font-sans text-xs font-bold tracking-widest uppercase">QuickBus Connect</Text>
          </View>
          <Text className="text-3xl font-sans font-extrabold text-textDark mb-2 text-center tracking-tight">
            Reset Password
          </Text>
          <Text className="text-base font-sans text-textMuted text-center leading-relaxed">
            Enter your email address to receive password reset instructions.
          </Text>
        </View>

        <AppCard className="mb-6">
          <AppInput
            label="Email Address"
            icon="mail-outline"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
          />

          <AppButton
            title="Send Reset Link"
            onPress={handleReset}
            loading={loading}
            className="mt-4 mb-4"
          />
        </AppCard>
      </View>
    </ScrollView>
  );

  return (
    <AppLayout useSafeArea>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </AppLayout>
  );
};

export default ForgotPasswordScreen;
