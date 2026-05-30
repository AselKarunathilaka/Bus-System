import React, { useContext, useState } from "react";
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import AppLayout from "../components/ui/AppLayout";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || error?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center", alignItems: Platform.OS === 'web' ? 'center' : 'stretch' }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className={Platform.OS === 'web' ? "w-full max-w-md" : ""}>
        <View className="mb-8 items-center">
          <View className="bg-primary/10 px-3 py-1 rounded-full mb-4">
            <Text className="text-primary font-sans text-xs font-bold tracking-widest uppercase">QuickBus Connect</Text>
          </View>
          <Text className="text-3xl font-sans font-extrabold text-textDark mb-2 text-center tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-base font-sans text-textMuted text-center leading-relaxed">
            Enter your credentials to access your account.
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
            returnKeyType="next"
          />

          <AppInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />

          <TouchableOpacity 
            className="self-end mb-6 mt-2"
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text className="text-primary font-sans font-bold text-sm">Forgot Password?</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <View className="bg-danger-bg border border-danger/20 p-4 rounded-xl mb-6 flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text className="text-danger font-medium text-sm ml-2 flex-1">{errorMessage}</Text>
            </View>
          ) : null}

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            className="mb-4"
          />

          <AppButton
            title="Create an Account"
            onPress={() => navigation.navigate("Register")}
            variant="ghost"
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

export default LoginScreen;