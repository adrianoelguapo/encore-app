/* --- Importaciones --- */
import BackgroundEffects from "@/components/BackgroundEffects";
import FloatingInput from "@/components/FloatingInput";
import Navbar from "@/components/Navbar";
import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { authService } from "@/services/authService";

/* --- Vista de inicio de sesión --- */
export default function Login() {

  /* --- Guardar nombre de usuario --- */
  const [username, setUsername] = useState("");

  /* --- Guardar contraseña --- */
  const [password, setPassword] = useState("");

  /* --- Mensaje de error --- */
  const [errorMessage, setErrorMessage] = useState("");

  /* --- Guardar estado de carga --- */
  const [isLoading, setIsLoading] = useState(false);

  /* --- Instancia del router para redirigir al usuario según su rol --- */
  const router = useRouter();

/* --- Manejar inicio de sesión --- */
  const handleLogin = async () => {

    setErrorMessage("");

    setIsLoading(true);

    try {
      
      /* --- Llamada al service de autenticación para iniciar sesión --- */
      const response = await authService.login(username, password);
      
      /* --- Obtener el usuario de la respuesta --- */
      const user = response?.user || authService.getCurrentUser();

      /* --- Según el rol del usuario, redirigir al panel correspondiente --- */
      if (user && user.role === 'admin') {

        router.replace("/admindashboard");

      } else {

        router.replace("/dashboard");

      }

    } catch (error: any) {

      /* --- Mostrar mensaje de error en caso de error de autenticación --- */
      setErrorMessage(error.message || "Invalid credentials. Please try again.");

    } finally {

      /* --- Finalizar carga --- */
      setIsLoading(false);

    }

  };

  return (

    /* --- Contenedor principal de la vista--- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo  --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} start = {{ x: 0.5, y: 0 }} end = {{ x: 0.5, y: 1 }} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Barra de navegación superior --- */}
      <View style = {styles.navbarWrapper}>

        <Navbar/>

      </View>

      {/* --- Contenido principal del formulario de login --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} showsVerticalScrollIndicator = {false}>

        {/* --- Contenido del formulario de login --- */}
        <View style = {styles.authContent}>

          {/* --- Contenedor del formulario de login --- */}
          <View style = {styles.authContainer}>

            {/* --- Header --- */}
            <View style =   {styles.authHeader}>

              {/* --- Título --- */}
              <Text style = {styles.pageTitle}>Welcome Back</Text>

              {/* --- Subtítulo --- */}
              <Text style = {styles.pageSubtitle}>Continue your musical journey</Text>

            </View>

            {/* --- Formulario --- */}
            <View style = {styles.form}>

              {/* --- Campo para el nombre de usuario --- */}
              <FloatingInput label = "Username" value = {username} onChangeText = {setUsername} placeholder = " "/>

              {/* --- Campo para la contraseña --- */}
              <FloatingInput label = "Password" value = {password} onChangeText = {setPassword} secureTextEntry placeholder = " "/>

              {/* --- Botón de submit --- */}
              <TouchableOpacity style = {[styles.actionButton, isLoading && styles.buttonDisabled]} onPress = {handleLogin} disabled = {isLoading}>

                {/* --- Si se está procesando la solicitud, se muestra el indicador de carga --- */}
                {isLoading ? (

                  <ActivityIndicator color = "#ffffff" size = "small" />

                ) : (

                  /* --- Si no se muestra el texto del botón con normalidad --- */
                  <Text style = {styles.buttonText}>Log In</Text>

                )}

              </TouchableOpacity>

              {/* --- Si hay algún error, se muestra --- */}
              {errorMessage ? (

                <Text style = {styles.errorMessage}>{errorMessage}</Text>

              ) : null}

            </View>

            {/* --- Footer --- */}
            <View style = {styles.authFooter}>

              {/* --- Mensaje del footer --- */}
              <Text style = {styles.footerMessage}>

                Don't have an account?{" "}

                {/* --- Enlace para redirigir al usuario al registro --- */}
                <Link href = "/register" asChild>

                  <TouchableOpacity>

                    <Text style = {styles.linkText}>Sign up here</Text>

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
    maxWidth: 480,

  },

  authHeader: {

    textAlign: "center",
    marginBottom: 64,

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

    gap: 16,

  },

  actionButton: {

    width: "100%",
    paddingVertical: 18,
    marginTop: 24,
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
    marginTop: 48,

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