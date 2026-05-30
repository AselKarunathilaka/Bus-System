import React, { useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "../components/ui/AppLayout";
import AppCard from "../components/ui/AppCard";
import AppInput from "../components/ui/AppInput";
import AppButton from "../components/ui/AppButton";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const CATEGORIES = [
  "Booking Issue",
  "Payment Issue",
  "Route Inquiry",
  "Bus Schedule Inquiry",
  "Account Issue",
  "General Support"
];

const ContactUsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORIES[5]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim() || message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post("/contact", {
        name,
        email,
        phone,
        subject,
        category,
        message,
      });

      Alert.alert(
        "Message Sent Successfully!",
        "Thank you for contacting us. Our support team will get back to you shortly.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubject("");
    setMessage("");
    setPhone(user?.phone || "");
    setCategory(CATEGORIES[5]);
    setErrors({});
  };

  return (
    <AppLayout useSafeArea>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        
        <View className="flex-row items-center justify-between mb-8 max-w-2xl w-full self-center">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 p-2">
              <Ionicons name="arrow-back" size={24} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-textDark tracking-tight">Contact Us</Text>
          </View>
        </View>

        <AppCard className="mb-6 max-w-2xl w-full self-center">
          <View className="bg-primary/10 self-start px-3 py-1 rounded-full mb-4 border border-primary/20">
            <Text className="text-xs font-bold text-primary tracking-widest uppercase">
              24/7 Support
            </Text>
          </View>
          <Text className="text-textMuted text-sm leading-relaxed mb-6">
            Have a question or facing an issue? Send us a message and our support team will help you as soon as possible.
          </Text>

          <View className="flex-row items-center mb-3">
            <Ionicons name="mail-outline" size={18} color="#2563EB" className="mr-3" />
            <Text className="text-textDark font-semibold">support@quickbus.com</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Ionicons name="call-outline" size={18} color="#2563EB" className="mr-3" />
            <Text className="text-textDark font-semibold">+94 11 234 5678</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={18} color="#2563EB" className="mr-3" />
            <Text className="text-textDark font-semibold">123 Transport Avenue, Colombo 03</Text>
          </View>
        </AppCard>

        <AppCard className="mb-10 max-w-2xl w-full self-center">
          <Text className="text-lg font-bold text-textDark mb-6 border-b border-border pb-4">Send a Message</Text>

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Full Name *</Text>
          <AppInput
            icon="person-outline"
            value={name}
            onChangeText={setName}
            containerClassName="mb-4"
          />
          {errors.name && <Text className="text-red-500 text-xs ml-1 -mt-2 mb-3">{errors.name}</Text>}

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Email Address *</Text>
          <AppInput
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerClassName="mb-4"
          />
          {errors.email && <Text className="text-red-500 text-xs ml-1 -mt-2 mb-3">{errors.email}</Text>}

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Phone Number (Optional)</Text>
          <AppInput
            icon="call-outline"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            containerClassName="mb-4"
          />

          <View className="mb-4">
            <Text className="text-[10px] font-bold text-textMuted uppercase mb-2 ml-1 tracking-widest">Category *</Text>
            <TouchableOpacity
              className="bg-background border border-border p-4 rounded-xl flex-row justify-between items-center"
              onPress={() => setOpenCategory(!openCategory)}
            >
              <Text className="text-textDark font-semibold text-base">{category}</Text>
              <Ionicons name={openCategory ? "chevron-up" : "chevron-down"} size={20} color="#94A3B8" />
            </TouchableOpacity>

            {openCategory && (
              <View className="mt-2 bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    className="p-4 border-b border-slate-100"
                    onPress={() => {
                      setCategory(cat);
                      setOpenCategory(false);
                    }}
                  >
                    <Text className="text-textDark font-medium">{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Subject *</Text>
          <AppInput
            icon="document-text-outline"
            value={subject}
            onChangeText={setSubject}
            containerClassName="mb-4"
          />
          {errors.subject && <Text className="text-red-500 text-xs ml-1 -mt-2 mb-3">{errors.subject}</Text>}

          <Text className="text-[10px] font-bold text-textMuted mb-2 uppercase tracking-widest ml-1">Message *</Text>
          <AppInput
            icon="chatbubble-outline"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            containerClassName="mb-4"
          />
          {errors.message && <Text className="text-red-500 text-xs ml-1 -mt-2 mb-3">{errors.message}</Text>}

          <View className="flex-row gap-3 mt-6">
            <View className="flex-1">
              <AppButton
                title="Clear"
                variant="secondary"
                onPress={handleReset}
              />
            </View>
            <View className="flex-1">
              <AppButton
                title={isSubmitting ? "Sending..." : "Submit"}
                variant="primary"
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </AppCard>

      </ScrollView>
    </AppLayout>
  );
};

export default ContactUsScreen;
