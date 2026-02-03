import {
    findUsernameByEmail,
    sendPasswordReset,
} from "@/src/services/passwordResetService";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ visible, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"select" | "password" | "username">(
    "select",
  );

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      Alert.alert(
        "Success",
        "Password reset email sent! Please check your inbox.",
        [{ text: "OK", onPress: handleClose }],
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameLookup = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const result = await findUsernameByEmail(email);
      Alert.alert("Account Found", `Your account email is: ${result.email}`, [
        { text: "OK", onPress: handleClose },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMode("select");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="black" />
          </Pressable>

          {mode === "select" && (
            <>
              <Text style={styles.title}>Account Recovery</Text>
              <Text style={styles.description}>
                What do you need help with?
              </Text>

              <Pressable
                style={styles.optionButton}
                onPress={() => setMode("username")}
              >
                <Feather name="user" size={24} color="black" />
                <Text style={styles.optionText}>Find My Username</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => setMode("password")}
              >
                <Ionicons name="key-outline" size={24} color="black" />
                <Text style={styles.optionText}>Reset Password</Text>
              </Pressable>
            </>
          )}

          {mode === "password" && (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.description}>
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Pressable
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handlePasswordReset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Send Reset Link</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.backButton}
                onPress={() => setMode("select")}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </Pressable>
            </>
          )}

          {mode === "username" && (
            <>
              <Text style={styles.title}>Find Username</Text>
              <Text style={styles.description}>
                Enter your email address to retrieve your account information.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Pressable
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleUsernameLookup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Find Username</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.backButton}
                onPress={() => setMode("select")}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#dcedc8",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "black",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f8e9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  backButton: {
    padding: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#666",
    fontSize: 14,
  },
});
