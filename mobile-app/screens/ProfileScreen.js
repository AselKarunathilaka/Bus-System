import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassButton from "../components/GlassButton";
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
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-black/5 p-2 rounded-full border border-black/5">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-3xl font-black text-slate-900 shadow-sm flex-1 tracking-tight">My Profile</Text>
        </View>

        <GlassCard className="mb-6">
          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Full Name</Text>
          <TextInput
            className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#94a3b8"
          />

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Email</Text>
          <TextInput
            className="bg-black/5 border border-black/5 text-slate-400 p-4 rounded-xl mb-4 font-semibold text-base"
            value={user?.email || ""}
            editable={false}
          />

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Phone</Text>
          <TextInput
            className="bg-black/5 border border-black/10 text-slate-900 p-4 rounded-xl mb-4 font-semibold text-base"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#94a3b8"
          />

          <Text className="text-sm font-bold text-slate-500 mb-2 uppercase">Role</Text>
          <TextInput
            className="bg-black/5 border border-black/5 text-slate-400 p-4 rounded-xl mb-4 font-semibold text-base uppercase"
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