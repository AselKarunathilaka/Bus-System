import React, { useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LiquidBackground from "../components/LiquidBackground";
import GlassCard from "../components/GlassCard";
import GlassInput from "../components/GlassInput";
import GlassButton from "../components/GlassButton";
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
    <LiquidBackground>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        
        <View className="flex-row items-center justify-between mb-6 mt-2">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 bg-[rgba(255,255,255,0.2)] p-2 rounded-full border border-[rgba(255,255,255,0.3)]">
              <Ionicons name="arrow-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <Text className="text-2xl font-extrabold text-white tracking-tight">Contact Us</Text>
          </View>
        </View>

        <GlassCard className="mb-4">
          <Text className="text-xs font-bold text-primary bg-[rgba(255,255,255,0.4)] self-start px-3 py-1 rounded-full mb-3 border border-[rgba(255,255,255,0.5)]">
            24/7 Support
          </Text>
          <Text className="text-slate-200 text-sm leading-relaxed mb-4">
            Have a question or facing an issue? Send us a message and our support team will help you as soon as possible.
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="mail" size={16} color="#3b82f6" className="mr-2" />
            <Text className="text-white font-semibold">support@quickbus.com</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="call" size={16} color="#3b82f6" className="mr-2" />
            <Text className="text-white font-semibold">+94 11 234 5678</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={16} color="#3b82f6" className="mr-2" />
            <Text className="text-white font-semibold">123 Transport Avenue, Colombo 03</Text>
          </View>
        </GlassCard>

        <GlassCard className="mb-8">
          <Text className="text-lg font-bold text-white mb-4">Send a Message</Text>

          <GlassInput
            label="Full Name *"
            icon="person"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <GlassInput
            label="Email Address *"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <GlassInput
            label="Phone Number (Optional)"
            icon="call"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View className="mb-4">
            <Text className="text-xs font-bold font-sans text-white uppercase mb-2 ml-1 tracking-wider">Category *</Text>
            <TouchableOpacity
              className="bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.5)] p-4 rounded-3xl flex-row justify-between items-center"
              onPress={() => setOpenCategory(!openCategory)}
            >
              <Text className="text-textDark font-semibold text-base">{category}</Text>
              <Ionicons name={openCategory ? "chevron-up" : "chevron-down"} size={18} color="#5C7185" />
            </TouchableOpacity>

            {openCategory && (
              <View className="mt-2 bg-[rgba(255,255,255,0.8)] rounded-xl border border-[rgba(255,255,255,0.8)] overflow-hidden shadow-sm">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    className="p-3 border-b border-[rgba(255,255,255,0.5)]"
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

          <GlassInput
            label="Subject *"
            icon="document-text"
            value={subject}
            onChangeText={setSubject}
            error={errors.subject}
          />

          <GlassInput
            label="Message *"
            icon="chatbubble"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            className="h-24 py-3"
            error={errors.message}
          />

          <View className="flex-row gap-3 mt-4">
            <GlassButton
              title="Clear"
              variant="secondary"
              className="flex-1"
              onPress={handleReset}
            />
            <GlassButton
              title={isSubmitting ? "Sending..." : "Submit"}
              variant="primary"
              className="flex-1"
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
          </View>
        </GlassCard>

      </ScrollView>
    </LiquidBackground>
  );
};

export default ContactUsScreen;
