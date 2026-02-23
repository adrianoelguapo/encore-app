/**
 * Colores y estilos del tema Encore Festival
 * Se replica el diseño elegante con gradientes morados y negros
 */

import { Platform } from "react-native";

// Colores principales del tema
export const Colors = {
  primary: {
    purple: "#c4b5fd",
    darkPurple: "#8b5cf6",
    indigo: "#6366f1",
    deepDark: "#000000",
    darkAccent: "#1a0033",
  },
  dark: {
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    background: "#000000",
    navBg: "rgba(20, 15, 35, 0.6)",
    border: "rgba(139, 92, 246, 0.2)",
    shadowColor: "rgba(139, 92, 246, 0.35)",
    buttonHover: "#ddd6fe",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
