import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import LiquidBackground from "../components/LiquidBackground";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please enter both email and password.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || error?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
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
          <GlassCard className="mb-6 items-center">
            <View className="bg-[rgba(255,255,255,0.4)] px-4 py-2 rounded-full border border-[rgba(255,255,255,0.5)] mb-4">
              <Text className="text-primary text-xs font-bold">QuickBus Connect</Text>
            </View>
            <Text className="text-3xl font-bold text-textDark mb-2 text-center">
              Login
            </Text>
            <Text className="text-sm text-textMuted text-center leading-relaxed">
              Welcome back to the minimalist QuickBus portal.
            </Text>
          </GlassCard>

          <GlassCard className="mb-6">
            <Text className="text-xl font-bold text-textDark mb-6 text-center">
              Account Access
            </Text>

            <GlassInput
              icon="mail"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <GlassInput
              icon="lock-closed"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
            />

            <TouchableOpacity 
              className="self-end mb-6 mr-1"
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text className="text-primary font-bold text-sm tracking-wide">Forgot Password?</Text>
            </TouchableOpacity>

            <GlassButton
              title={loading ? "Authenticating..." : "Login to Dashboard"}
              onPress={handleLogin}
              className="mb-6"
              variant="primary"
            />

            <GlassButton
              title="Create an Account"
              onPress={() => navigation.navigate("Register")}
              variant="secondary"
            />
          </GlassCard>

        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default LoginScreen;