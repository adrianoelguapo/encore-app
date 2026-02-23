import BackgroundEffects from "@/components/BackgroundEffects";
import FloatingInput from "@/components/FloatingInput";
import Navbar from "@/components/Navbar";
import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { authService } from "@/services/authService";

/**
 * Vista de Register
 */
export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setErrorMessage("");

    setIsLoading(true);

    try {
      // Pasamos los parámetros necesarios para registrarse (incluyendo nombre)
      await authService.register(username, password, name);

      // Tras registrar con éxito, enviamos al login
      router.replace("/login");
    } catch (error: any) {
      setErrorMessage(error.message || "Error during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} start = {{ x: 0.5, y: 0 }} end = {{ x: 0.5, y: 1 }} style = {styles.gradientContainer}/>
      <BackgroundEffects />

      {/* --- Barra de navegación superior --- */}
      <View style = {styles.navbarWrapper}>

        <Navbar />

      </View>

      {/* --- Contenido principal del formualrio de registro --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} showsVerticalScrollIndicator = {false}>
        
        {/* --- Contenido del formulario de registro --- */}
        <View style = {styles.authContent}>

          {/* --- Contenedor del formulario de registro --- */}
          <View style = {styles.authContainer}>

            {/* --- Header --- */}
            <View style = {styles.authHeader}>

              {/* --- Título --- */}
              <Text style = {styles.pageTitle}>Join Us</Text>

              {/* --- Subtítulo --- */}
              <Text style = {styles.pageSubtitle}>Start your festival experience today</Text>
            
            </View>

            {/* --- Formulario --- */}
            <View style = {styles.form}>

              {/* --- Input para el nombre completo --- */}
              <FloatingInput label = "Full Name" value = {name} onChangeText = {setName} placeholder = " "/>

              {/* --- Input para el nombre de usuario --- */}
              <FloatingInput label = "Username" value = {username} onChangeText = {setUsername} placeholder = " "/>

              {/* --- Input para la contraseña --- */}
              <FloatingInput label = "Password" value = {password} onChangeText = {setPassword} secureTextEntry placeholder = " "/>

              {/* --- Input para confirmar la contraseña --- */}
              <FloatingInput label = "Confirm Password" value = {confirmPassword} onChangeText = {setConfirmPassword} secureTextEntry placeholder = " "/>

              {/* --- Botón de submit --- */}
              <TouchableOpacity style = {[styles.actionButton, isLoading && styles.buttonDisabled]} onPress = {handleRegister} disabled = {isLoading}>

                {isLoading ? (

                  <ActivityIndicator color="#ffffff" size="small" />

                ) : (

                  <Text style={styles.buttonText}>Create Account</Text>

                )}

              </TouchableOpacity>

              {/* Mensaje de error */}
              {errorMessage ? (

                <Text style={styles.errorMessage}>{errorMessage}</Text>

              ) : null}

            </View>

            {/* --- Footer --- */}
            <View style = {styles.authFooter}>

              {/* --- Mensaje del footer --- */}
              <Text style = {styles.footerMessage}>
                
                Already have an account?{" "}

                {/* --- Enlace para redirigir al usuario al login --- */}
                <Link href = "/login" asChild>

                  <TouchableOpacity>

                    <Text style = {styles.linkText}>Log in here</Text>

                  </TouchableOpacity>

                </Link>

              </Text>

            </View>

          </View>

        </View>

      </ScrollView>

    </View>

  );

}

/* --- Estilos de la vista --- */
const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: Colors.dark.background,
    position: "relative",

  },

  gradientContainer: {

    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,

  },

  navbarWrapper: {

    zIndex: 100,

  },

  scrollContent: {

    flexGrow: 1,
    justifyContent: "center",

  },

  authContent: {

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 50,
    marginVertical: 40,

  },

  authContainer: {

    width: "100%",
    maxWidth: 520,

  },

  authHeader: {

    textAlign: "center",
    marginBottom: 56,

  },

  pageTitle: {

    fontSize: 48,
    fontWeight: "900",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1,
    shadowColor: "#c4b5fd",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,

  },

  pageSubtitle: {

    fontSize: 18,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: -0.3,

  },

  form: {

    gap: 12,

  },

  actionButton: {

    width: "100%",
    paddingVertical: 18,
    marginTop: 16,
    backgroundColor: "#8b5cf6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,

  },

  buttonDisabled: {

    opacity: 0.7,

  },

  buttonText: {

    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark.text,
    letterSpacing: -0.5,

  },
  errorMessage: {

    color: "#ff6b6b",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 16,

  },

  authFooter: {

    textAlign: "center",
    marginTop: 40,

  },

  footerMessage: {
    
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    textAlign: "center",

  },

  linkText: {

    color: "#c4b5fd",
    fontWeight: "600",

  },


});