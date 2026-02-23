import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authService } from "@/services/authService";
import BackgroundEffects from "@/components/BackgroundEffects";
import UserBottomNav from "@/components/UserBottomNav";
import FloatingInput from "@/components/FloatingInput";
import { Colors } from "@/constants/theme";

export default function Profile() {
  const user = authService.getCurrentUser();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
    }
  }, []);

  const handleUpdateProfile = async () => {
    if (!name || !username || !password) {
      Alert.alert("Error", "All fields are required to verify changes");
      return;
    }

    setIsLoading(true);
    try {
      await authService.updateProfile(user.id, {
        name,
        username,
        password
      });
      Alert.alert("Success", "Profile updated successfully");
      setPassword(""); 
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a0033", "#000000", "#0a0015"]} style={styles.gradientContainer} />
      <BackgroundEffects />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header con marginTop de 70 */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings</Text>
        </View>

        {/* Contenedor del formulario sin bordes y alineado a la izquierda */}
        <View style={styles.profileContent}>
          <View style={styles.form}>
            <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
            
            <FloatingInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder=" "
            />

            <FloatingInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder=" "
            />

            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SECURITY</Text>
            
            <FloatingInput
              label="Current or New Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder=" "
            />

            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.disabledButton]} 
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <UserBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
  gradientContainer: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  scrollContent: { padding: 25, paddingBottom: 120 },
  header: { 
    marginTop: 70, // Ajuste solicitado
    marginBottom: 40,
    alignItems: 'flex-start' // Alineación a la izquierda
  },
  title: { fontSize: 36, fontWeight: "900", color: 'white', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: "rgba(255, 255, 255, 0.5)", marginTop: 6 },
  profileContent: {
    width: '100%',
    alignItems: 'flex-start', // Alineación del contenido a la izquierda
  },
  sectionLabel: {
    color: "#c4b5fd",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 25,
    textAlign: 'left', // Texto a la izquierda
  },
  form: { 
    width: '100%',
    gap: 12,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#8b5cf6",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    width: '100%',
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 8,
  },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "700" },
  disabledButton: { opacity: 0.6 },
});