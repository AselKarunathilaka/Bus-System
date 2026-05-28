import React, { useContext, useState, useEffect } from "react";
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

  return (
    <LiquidBackground>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={90}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <GlassCard className="mb-6 items-center">
            <View className="bg-[rgba(255,255,255,0.4)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.5)] mb-3">
              <Text className="text-primary font-sans text-[10px] font-bold tracking-widest uppercase">QuickBus Connect</Text>
            </View>
            <Text className="text-3xl font-sans font-extrabold text-textDark mb-1 text-center tracking-tight">
              Login
            </Text>
            <Text className="text-sm font-sans text-textMuted text-center leading-relaxed">
              Welcome back to the minimalist QuickBus portal.
            </Text>
          </GlassCard>

          <GlassCard className="mb-6 p-4">
            <Text className="text-lg font-sans font-bold text-textDark mb-4 text-center tracking-tight">
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
              className="self-end mb-5 mr-1"
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text className="text-primary font-sans font-bold text-xs tracking-wide">Forgot Password?</Text>
            </TouchableOpacity>

            {errorMessage ? (
              <View className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl mb-4 flex-row items-center">
                <Ionicons name="warning" size={16} color="#ef4444" />
                <Text className="text-red-400 font-bold text-xs ml-2 flex-1">{errorMessage}</Text>
              </View>
            ) : null}

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
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <GlassCard className="mb-6 items-center">
              <View className="bg-[rgba(255,255,255,0.4)] px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.5)] mb-3">
                <Text className="text-primary font-sans text-[10px] font-bold tracking-widest uppercase">QuickBus Connect</Text>
              </View>
              <Text className="text-3xl font-sans font-extrabold text-textDark mb-1 text-center tracking-tight">
                Login
              </Text>
              <Text className="text-sm font-sans text-textMuted text-center leading-relaxed">
                Welcome back to the minimalist QuickBus portal.
              </Text>
            </GlassCard>

            <GlassCard className="mb-6 p-4">
              <Text className="text-lg font-sans font-bold text-textDark mb-4 text-center tracking-tight">
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
                className="self-end mb-5 mr-1"
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text className="text-primary font-sans font-bold text-xs tracking-wide">Forgot Password?</Text>
              </TouchableOpacity>

              {errorMessage ? (
                <View className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl mb-4 flex-row items-center">
                  <Ionicons name="warning" size={16} color="#ef4444" />
                  <Text className="text-red-400 font-bold text-xs ml-2 flex-1">{errorMessage}</Text>
                </View>
              ) : null}

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
        </View>
      )}
    </LiquidBackground>
  );
};

export default LoginScreen;