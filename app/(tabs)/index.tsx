/* --- Importaciones --- */
import BackgroundEffects from "@/components/BackgroundEffects";
import Navbar from "@/components/Navbar";
import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

/* --- Vista de inicio --- */
export default function Home() {

  /* --- Obtener el ancho y alto de la pantalla --- */
  const { width, height } = Dimensions.get("window");


  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} start = {{ x: 0.5, y: 0 }} end = {{ x: 0.5, y: 1 }} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Contenedor principal del contenido --- */}
      <View style = {styles.content}>

        {/* --- Barra de navegación superior --- */}
        <Navbar/>

        {/* --- Sección principal --- */}
        <View style = {styles.heroSection}>

          {/* --- Contenedor principal de la sección principal --- */}
          <View style = {styles.heroContainer}>

            {/* --- Título --- */}
            <Text style = {styles.mainHeading}>Where Music{"\n"}Meets Magic</Text>

            {/* --- Descripción --- */}
            <Text style = {styles.heroDescription}>Join thousands of music lovers at the most anticipated festival of the year</Text>

          </View>

        </View>

      </View>

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

  content: {

    flex: 1,
    justifyContent: "flex-start",

  },

  heroSection: {

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,

  },

  heroContainer: {

    alignItems: "center",
    paddingHorizontal: 20,

  },

  mainHeading: {

    fontSize: 56,
    fontWeight: "800",
    color: Colors.dark.text,
    textAlign: "center",
    lineHeight: 65,
    marginBottom: 24,
    letterSpacing: -1,
    width: "0%",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,

  },

  heroDescription: {

    fontSize: 18,
    color: Colors.dark.textSecondary,
    fontWeight: "400",
    maxWidth: 600,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 48,

  },

});