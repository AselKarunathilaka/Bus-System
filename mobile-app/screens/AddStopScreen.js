import React, { useContext, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const AddStopScreen = ({ route, navigation }) => {
  const { token } = useContext(AuthContext);
  const { routeId } = route.params;

  const [stopName, setStopName] = useState("");
  const [location, setLocation] = useState("");
  const [order, setOrder] = useState("");

  const handleCreateStop = async () => {
    if (!stopName || !location || !order) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      await api.post(
        "/stops",
        {
          stopName,
          location,
          order: Number(order),
          routeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Stop created successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create stop"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Stop</Text>

      <TextInput
        style={styles.input}
        placeholder="Stop Name"
        value={stopName}
        onChangeText={setStopName}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Order"
        value={order}
        onChangeText={setOrder}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateStop}>
        <Text style={styles.buttonText}>Create Stop</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddStopScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
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
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});