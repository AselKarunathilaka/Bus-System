import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppButton from "../components/ui/AppButton";
import AppInput from "../components/ui/AppInput";
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
    <AppLayout useSafeArea>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="flex-row items-center justify-between mb-8 max-w-md w-full self-center">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">My Profile</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab")} className="p-2">
            <Ionicons name="home-outline" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <AppCard className="mb-8 max-w-md w-full self-center">
          <View className="items-center mb-8 pb-6 border-b border-border">
            <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4 border border-primary/20">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-xl font-bold text-textDark">{user?.fullName || "User"}</Text>
            <Text className="text-sm font-medium text-textMuted mt-1">{user?.email}</Text>
            <View className="bg-slate-100 px-3 py-1 rounded-full mt-3 border border-slate-200">
              <Text className="text-xs font-bold text-slate-600 uppercase tracking-widest">{user?.role || "User"}</Text>
            </View>
          </View>

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Full Name</Text>
          <AppInput
            icon="person-outline"
            value={fullName}
            onChangeText={setFullName}
            containerClassName="mb-4"
          />

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Email</Text>
          <AppInput
            icon="mail-outline"
            value={user?.email || ""}
            editable={false}
            containerClassName="mb-4 opacity-70"
          />

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Phone</Text>
          <AppInput
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            containerClassName="mb-4"
          />
        </AppCard>

        <View className="max-w-md w-full self-center mb-10">
          <AppButton
            title={loading ? "Updating..." : "Update Profile"}
            onPress={handleUpdate}
            disabled={loading}
            variant="primary"
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ProfileScreen;