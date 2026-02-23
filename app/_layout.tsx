/* --- Importaciones --- */
import {DarkTheme, DefaultTheme, ThemeProvider,} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { loadFonts } from "@/constants/fonts";
import { useColorScheme } from "@/hooks/use-color-scheme";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {

  anchor: "(tabs)",

};

export default function RootLayout() {

  const colorScheme = useColorScheme();

  useEffect(() => {

    async function prepare() {

      try {

        await loadFonts();

      } catch (e) {

        console.warn(e);

      } finally {

        await SplashScreen.hideAsync();

      }

    }

    prepare();

  }, []);

  return (

    <ThemeProvider value = {colorScheme === "dark" ? DarkTheme : DefaultTheme}>

      <Stack>

        <Stack.Screen name = "(tabs)" options = {{ headerShown: false }}/>
        <Stack.Screen name = "modal" options = {{ presentation: "modal", title: "Modal" }}/>

      </Stack>

      <StatusBar style = "light"/>

    </ThemeProvider>
  );
}
