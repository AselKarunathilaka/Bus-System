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
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import LiquidBackground from "../components/LiquidBackground";

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

  return (
    <LiquidBackground>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlassCard className="mb-6">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="mb-6 flex-row items-center"
            >
              <Ionicons name="arrow-back" size={20} color="#2F80ED" />
              <Text className="text-primary font-bold ml-2">Back to Login</Text>
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-textDark mb-2">
              Reset Password
            </Text>
            <Text className="text-sm text-textMuted leading-relaxed mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            <GlassInput
              icon="mail"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
            />

            <GlassButton
              title={loading ? "Sending Link..." : "Send Reset Link"}
              onPress={handleReset}
              className="mt-2"
              variant="primary"
            />
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default ForgotPasswordScreen;
