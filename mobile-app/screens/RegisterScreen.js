import React, { useContext, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import LiquidBackground from "../components/LiquidBackground";

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sanitizeNameField = (text) => {
    return text.replace(/[^A-Za-z\s.'-]/g, "");
  };

  const sanitizePhoneField = (text) => {
    return text.replace(/[^0-9]/g, "");
  };

  const validateForm = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return false;
    }

    if (!/^[A-Za-z\s.'-]+$/.test(fullName.trim())) {
      Alert.alert(
        "Validation Error",
        "Full name can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }

    if (!/^\d+$/.test(phone.trim())) {
      Alert.alert("Validation Error", "Phone number must contain numbers only.");
      return false;
    }

    if (phone.trim().length < 10 || phone.trim().length > 12) {
      Alert.alert(
        "Validation Error",
        "Phone number should be between 10 and 12 digits."
      );
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters long."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      Alert.alert("Success", "Registration successful.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message || error?.message || "Something went wrong."
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
            <View className="bg-white/10 px-4 py-2 rounded-full border border-white/10 mb-4">
              <Text className="text-white text-xs font-bold">QuickBus Portal</Text>
            </View>
            <Text className="text-3xl font-bold text-white mb-2 text-center">
              Create Account
            </Text>
            <Text className="text-sm text-slate-300 text-center leading-relaxed">
              Register to browse highway routes, view stops, and use the QuickBus system.
            </Text>
          </GlassCard>

          <GlassCard className="mb-6">
            <Text className="text-xl font-bold text-white mb-6 text-center">
              Get Started
            </Text>

            <View className="bg-black/40 border border-white/10 rounded-2xl px-4 mb-4">
              <TextInput
                className="py-4 text-base text-white font-semibold"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                placeholder="Full Name"
                placeholderTextColor="#94a3b8"
                value={fullName}
                onChangeText={(text) => setFullName(sanitizeNameField(text))}
                returnKeyType="next"
              />
            </View>

            <View className="bg-black/40 border border-white/10 rounded-2xl px-4 mb-4">
              <TextInput
                className="py-4 text-base text-white font-semibold"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                placeholder="Email Address"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View className="bg-black/40 border border-white/10 rounded-2xl px-4 mb-4">
              <TextInput
                className="py-4 text-base text-white font-semibold"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                placeholder="Phone Number"
                placeholderTextColor="#94a3b8"
                value={phone}
                onChangeText={(text) => setPhone(sanitizePhoneField(text))}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
            </View>

            <View className="bg-black/40 border border-white/10 rounded-2xl px-4 mb-6">
              <TextInput
                className="py-4 text-base text-white font-semibold"
                style={Platform.OS === 'web' ? { outlineStyle: 'none' } : {}}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
              />
            </View>

            <GlassButton
              title={loading ? "Creating Account..." : "Register"}
              onPress={handleRegister}
              className="mb-6"
              variant="primary"
            />

            <GlassButton
              title="Already have an account? Login"
              onPress={() => navigation.navigate("Login")}
              variant="secondary"
            />
          </GlassCard>

          <View className="h-[30px]" />
        </ScrollView>
      </KeyboardAvoidingView>
    </LiquidBackground>
  );
};

export default RegisterScreen;

// We've moved styles to Tailwind classes!