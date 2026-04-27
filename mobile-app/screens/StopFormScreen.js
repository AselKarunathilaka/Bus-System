import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const StopFormScreen = ({ route, navigation }) => {
  const { token, userToken } = useContext(AuthContext);
  const authToken = token || userToken;

  const routeId = route.params?.routeId;
  const stopData = route.params?.stopData;

  const [stopName, setStopName] = useState(stopData?.stopName || "");
  const [location, setLocation] = useState(stopData?.location || "");
  const [order, setOrder] = useState(
    stopData?.order !== undefined ? String(stopData.order) : ""
  );
  const [loading, setLoading] = useState(false);

  const sanitizeNameField = (text) => {
    return text.replace(/[^A-Za-z\s.'\-()/]/g, "");
  };

  const sanitizeNumericField = (text) => {
    return text.replace(/[^0-9]/g, "");
  };

  const validateForm = () => {
    if (!stopName.trim() || !location.trim() || !order.trim()) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(stopName.trim())) {
      Alert.alert(
        "Validation Error",
        "Stop name can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^[A-Za-z\s.'\-()/]+$/.test(location.trim())) {
      Alert.alert(
        "Validation Error",
        "Location can only contain letters, spaces, and simple punctuation."
      );
      return false;
    }

    if (!/^\d+$/.test(order.trim())) {
      Alert.alert("Validation Error", "Stop order must contain numbers only.");
      return false;
    }

    if (Number(order) <= 0) {
      Alert.alert("Validation Error", "Stop order must be greater than 0.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      stopName: stopName.trim(),
      location: location.trim(),
      order: Number(order),
      routeId,
    };

    try {
      setLoading(true);

      if (stopData) {
        await api.put(`/stops/${stopData._id}`, payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Stop updated successfully.");
      } else {
        await api.post("/stops", payload, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Alert.alert("Success", "Stop created successfully.");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to save stop."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <Text style={styles.title}>{stopData ? "Edit Stop" : "Add Stop"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Stop Name"
          value={stopName}
          onChangeText={(text) => setStopName(sanitizeNameField(text))}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={(text) => setLocation(sanitizeNameField(text))}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Order"
          value={order}
          onChangeText={(text) => setOrder(sanitizeNumericField(text))}
          keyboardType="numeric"
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? stopData
                ? "Updating..."
                : "Creating..."
              : stopData
              ? "Update Stop"
              : "Create Stop"}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StopFormScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40,
  },
});