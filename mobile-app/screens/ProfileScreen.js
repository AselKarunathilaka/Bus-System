import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
import GlassInput from "../components/GlassInput";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const { user, getProfile, updateProfile } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    getProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile(user._id || user.id, { fullName, phone });
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiquidBackground>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-white/10 p-2 rounded-full border border-white/10">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white shadow-sm tracking-tight">My Profile</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="bg-white/10 p-2 rounded-full border border-white/10">
            <Ionicons name="home" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <GlassCard className="mb-6">
          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Full Name</Text>
          <GlassInput
            icon="person"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#94a3b8"
          />

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Email</Text>
          <GlassInput
            icon="mail"
            value={user?.email || ""}
            editable={false}
          />

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Phone</Text>
          <GlassInput
            icon="call"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#94a3b8"
          />

          <Text className="text-sm font-bold text-slate-400 mb-2 uppercase">Role</Text>
          <GlassInput
            icon="shield-checkmark"
            value={user?.role || ""}
            editable={false}
          />
        </GlassCard>

        <GlassButton
          title={loading ? "Updating..." : "Update Profile"}
          onPress={handleUpdate}
          className="border-[#007AFF]/20"
          textClassName="text-white font-extrabold"
        />
      </ScrollView>
    </LiquidBackground>
  );
};

export default ProfileScreen;

// We've moved styles to Tailwind classes!