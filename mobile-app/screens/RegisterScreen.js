import React, { useContext, useState } from "react";
import {
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
import AppLayout from "../components/ui/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sanitizeNameField = (text) => text.replace(/[^A-Za-z\s.'-]/g, "");
  const sanitizePhoneField = (text) => text.replace(/[^0-9]/g, "");

  const validateForm = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return false;
    }
    if (!/^[A-Za-z\s.'-]+$/.test(fullName.trim())) {
      Alert.alert("Validation Error", "Full name can only contain letters, spaces, and simple punctuation.");
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
      Alert.alert("Validation Error", "Phone number should be between 10 and 12 digits.");
      return false;
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      Alert.alert("Validation Error", "Password must be at least 8 characters and include a letter and number.");
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
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message || error?.message || "Something went wrong."
      );
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
          <LinearGradient
            colors={["#2563EB", "#7C3AED"]}
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name="person-add" size={29} color="#FFFFFF" />
          </LinearGradient>
          <View 
            className="px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
          >
            <Text className="text-primary font-sans text-xs font-bold tracking-widest uppercase">QuickBus Portal</Text>
          </View>
          <Text className="text-3xl font-sans font-extrabold text-textDark mb-2 text-center tracking-tight">
            Create Account
          </Text>
          <Text className="text-base font-sans text-textMuted text-center leading-relaxed">
            Register to browse routes, view stops, and book tickets.
          </Text>
        </View>

        <AppCard className="mb-6">
          <AppInput
            label="Full Name"
            icon="person-outline"
            placeholder="John Doe"
            value={fullName}
            onChangeText={(text) => setFullName(sanitizeNameField(text))}
            returnKeyType="next"
          />

          <AppInput
            label="Email Address"
            icon="mail-outline"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          <AppInput
            label="Phone Number"
            icon="call-outline"
            placeholder="0712345678"
            value={phone}
            onChangeText={(text) => setPhone(sanitizePhoneField(text))}
            keyboardType="phone-pad"
            returnKeyType="next"
          />

          <AppInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="8+ characters with a number"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            className="mt-4 mb-4"
          />

          <AppButton
            title="Already have an account? Login"
            onPress={() => navigation.navigate("Login")}
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

export default RegisterScreen;
