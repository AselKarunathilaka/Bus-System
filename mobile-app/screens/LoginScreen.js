import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import SkeuCard from "../components/SkeuCard";
import SkeuButton from "../components/SkeuButton";

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
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SkeuCard className="mb-6 items-center">
          <Text className="bg-brand text-white px-4 py-2 rounded-full text-xs font-bold mb-4 overflow-hidden shadow-neo-light">
            QuickBus Connect
          </Text>
          <Text className="text-3xl font-extrabold text-slate-700 mb-2 text-center">
            Login
          </Text>
          <Text className="text-sm text-slate-500 text-center leading-relaxed">
            Welcome back to the neo-skeuomorphic QuickBus portal. Access your premium booking tools.
          </Text>
        </SkeuCard>

        <SkeuCard className="mb-6">
          <Text className="text-xl font-bold text-slate-700 mb-6 text-center">
            Account Access
          </Text>

          <View className="bg-background shadow-neo-inner rounded-2xl px-4 mb-4">
            <TextInput
              className="py-4 text-base text-slate-700 font-semibold"
              placeholder="Email Address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <View className="bg-background shadow-neo-inner rounded-2xl px-4 mb-6">
            <TextInput
              className="py-4 text-base text-slate-700 font-semibold"
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
            />
          </View>

          <SkeuButton
            title={loading ? "Authenticating..." : "Login to Dashboard"}
            onPress={handleLogin}
            className="mb-6"
            textClassName="text-brand"
          />

          <SkeuButton
            title="Create an Account"
            onPress={() => navigation.navigate("Register")}
            className="bg-transparent shadow-none border-2 border-slate-300"
            textClassName="text-slate-500"
          />
        </SkeuCard>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;