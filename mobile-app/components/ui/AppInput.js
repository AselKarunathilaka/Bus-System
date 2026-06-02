import React from "react";
import { View, TextInput, Text, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AppInput = ({
  icon,
  label,
  error,
  containerClassName = "",
  className = "",
  style,
  ...props
}) => {
  const getBorderColor = () => {
    if (error) return "#EF4444"; // danger
    return "#E2E8F0"; // border
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() }
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#EF4444" : "#64748B"}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor="#94A3B8"
          style={[styles.input, Platform.OS === "web" && { outlineStyle: "none" }]}
          autoCorrect={false}
          spellCheck={false}
          {...props}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // mb-4
  },
  label: {
    fontSize: 14, // text-sm
    fontFamily: "PlusJakartaSans-SemiBold",
    fontWeight: "600",
    color: "#0F172A", // textDark
    marginBottom: 6, // mb-1.5
    marginLeft: 4, // ml-1
  },
  inputContainer: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    borderWidth: 1.5, // border
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 16, // px-4
    paddingVertical: 4, // py-1
    backgroundColor: "#FFFFFF", // bg-surface
  },
  icon: {
    marginRight: 12, // mr-3
  },
  input: {
    flex: 1,
    color: "#0F172A", // text-textDark
    fontFamily: "PlusJakartaSans-Medium",
    fontWeight: "500",
    fontSize: 16, // text-base
    paddingVertical: 12, // py-3
    height: 56, // h-14
  },
  errorText: {
    color: "#EF4444", // text-danger
    fontFamily: "PlusJakartaSans-SemiBold",
    fontWeight: "600",
    fontSize: 12, // text-xs
    marginTop: 6, // mt-1.5
    marginLeft: 4, // ml-1
  }
});

export default AppInput;
