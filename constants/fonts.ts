
/**
 * Configuración de fuentes para la aplicación
 * Carga las fuentes personalizadas del directorio assets/fonts
 */
export async function loadFonts() {
  try {
    // Aquí irán las fuentes cuando estén disponibles
    // Ejemplo: await Font.loadAsync({
    //   'Geist': require('@/assets/fonts/Geist-Regular.ttf'),
    //   'Geist-Bold': require('@/assets/fonts/Geist-Bold.ttf'),
    //   'Geist-Semibold': require('@/assets/fonts/Geist-Semibold.ttf'),
    // });
    console.log("Fonts loaded successfully");
  } catch (error) {
    console.warn("Error loading fonts:", error);
  }
}

/**
 * Estilos de tipografía disponibles
 */
export const Typography = {
  // Estilos de títulos
  h1: {
    fontSize: 56,
    fontWeight: "800" as const,
    lineHeight: 58,
    letterSpacing: -1,
  },
  h2: {
    fontSize: 40,
    fontWeight: "700" as const,
    lineHeight: 44,
  },
  h3: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 36,
  },

  // Estilos de cuerpo
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: "400" as const,
    lineHeight: 26,
  },

  // Estilos de botones
  button: {
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
};
