import { Stack } from "expo-router";

/* --- Definir las vistas de la aplicación --- */
export default function TabsLayout() {

  return (

    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Screen name = "index" />
      <Stack.Screen name = "login" />
      <Stack.Screen name = "register" />
      <Stack.Screen name = "dashboard" />
      <Stack.Screen name = "concerts" />  
      <Stack.Screen name = "bookings" />  
      <Stack.Screen name = "profile" />   
      <Stack.Screen name = "admindashboard" />

    </Stack>
  );
}