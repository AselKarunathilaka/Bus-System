import React, { useContext, useState } from "react";
import {
<<<<<<< HEAD
=======
  ScrollView,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
<<<<<<< HEAD
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
=======
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
<<<<<<< HEAD
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long.");
=======
    if (!fullName || !email || !phone || !password) {
      Alert.alert("Error", "Please fill all fields");
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
      return;
    }

    try {
      setLoading(true);

      await register({
<<<<<<< HEAD
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
=======
        fullName,
        email,
        phone,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
        password,
        role: "user",
      });

      Alert.alert("Success", "Registration successful");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
<<<<<<< HEAD
        error?.response?.data?.message || error?.message || "Something went wrong"
=======
        error?.response?.data?.message || "Something went wrong"
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.badge}>QuickBus (Highway Bus Reservation System)</Text>
          <Text style={styles.heroTitle}>Create Your Account</Text>
          <Text style={styles.heroSubtitle}>
            Register to browse highway routes, view stops, and use the QuickBus system.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Get Started</Text>
          <Text style={styles.formSubtitle}>
            Create an account to begin using the system
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
=======
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
<<<<<<< HEAD
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#eef4ff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
  },
  heroCard: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#cbd5e1",
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 8,
  },
  formSubtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 15,
    marginBottom: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#3567e0",
    padding: 16,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 18,
  },
  buttonDisabled: {
    opacity: 0.7,
=======
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 16,
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
<<<<<<< HEAD
    fontWeight: "800",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 30,
=======
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
>>>>>>> af0d9688e2512a5cbc3b499567371b80a653ca94
  },
});