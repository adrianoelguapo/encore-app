/* --- Importaciones --- */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authService } from "@/services/authService";
import BackgroundEffects from "@/components/BackgroundEffects";
import UserBottomNav from "@/components/UserBottomNav";
import ActivityCard from "@/components/ActivityCard";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

/* --- Vista de exploración de conciertos activos (user) --- */
export default function Concerts() {

  /* --- Guardar todos los conciertos --- */
  const [activities, setActivities] = useState([]);
  
  /* --- Guardar las reservas del usuario --- */
  const [userBookings, setUserBookings] = useState<number[]>([]);
  
  /* --- Refrescar la vista --- */
  const [refreshing, setRefreshing] = useState(false);
  
  /* --- Obtener el usuario actual --- */
  const user = authService.getCurrentUser();

  /* --- Cargar los conciertos y las reservas --- */
  const fetchData = async () => {

    try {

      /* --- Obtener el token --- */
      const token = authService.getToken();
      
      /* --- Realizar la petición al backend para obtener los conciertos --- */
      const actRes = await fetch(`${API_BASE_URL}/activities?state=active`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Guardar los datos --- */
      const actData = await actRes.json();
      setActivities(actData);

      /* --- Realizar la petición al backend para obtener las reservas del usuario --- */
      const bookRes = await fetch(`${API_BASE_URL}/users/${user.id}/bookings`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Guardar los datos --- */
      const bookData = await bookRes.json();
      setUserBookings(bookData.map((b: any) => b.activity_id));
      
    } catch (error) {

      /* --- Si hay un error, se devuelve --- */
      console.error("Error fetching concerts:", error);

    }

  };

  /* --- Cargar los datos al iniciar la vista --- */
  useEffect(() => { fetchData(); }, []);

  /* --- Al refrescar la vista, se cargan los datos --- */
  const onRefresh = useCallback(() => {

    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));

  }, []);

  /* --- Al reservar un concierto --- */
  const handleBook = async (activity: any) => {

    try {

      /* --- Obtener el token --- */
      const token = authService.getToken();

      /* --- Realizar la petición al backend --- */
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/bookings/${activity.id}`, {

        method: 'POST',

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Guardar los datos --- */
      const data = await res.json();

      /* --- Si hay un error, se devuelve --- */
      if (!res.ok) throw new Error(data.error);
      
      /* --- Se muestra un alert de éxito --- */
      Alert.alert("Success", "Booking confirmed!");
      
      /* --- Se recargan los datos --- */
      fetchData();

    } catch (error: any) {

      /* --- Si hay un error, se muestra un alert con el error --- */
      Alert.alert("Error", error.message);

    }
  };

  /* --- Al cancelar un concierto --- */
  const handleCancel = async (activity: any) => {

    Alert.alert("Cancel", /* --- Título --- */

      "Are you sure you want to cancel this booking?", /* --- Mensaje --- */

      /* --- Botones --- */
      [
        { text: "No" },

        /* --- Botón de confirmación --- */
        { text: "Yes", onPress: async () => {

            try {

              /* --- Obtener el token --- */
              const token = authService.getToken();

              /* --- Realizar la petición al backend --- */
              const res = await fetch(`${API_BASE_URL}/users/${user.id}/bookings/${activity.id}`, {

                method: 'DELETE',

                /* --- Enviar el token en la petición --- */
                headers: { 'Auth': `Bearer ${token}` }

              });

              /* --- Si la petición es exitosa --- */
              if (res.ok) {

                /* --- Se muestra un alert de éxito --- */
                Alert.alert("Cancelled", "Your booking has been removed.");
                
                /* --- Se recargan los datos --- */
                fetchData();

              }

            } catch (error) {

              /* --- Si hay un error, se muestra un alert con el error --- */
              Alert.alert("Error", "Could not cancel booking.");

            }

          }

        }

    ]);

  };

  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} style = {styles.gradientContainer} />
      <BackgroundEffects/>

      {/* --- Contenedor con scroll para mostrar los conciertos --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#8b5cf6"/>}>
        
        {/* --- Header --- */}
        <View style = {styles.header}>

          {/* --- Título --- */}
          <Text style = {styles.title}>Concerts</Text>

          {/* --- Subtítulo --- */}
          <Text style = {styles.subtitle}>Discover and book upcoming events</Text>
        
        </View>

        {/* --- Si hay uno o más conciertos activos --- */}
        {activities.length > 0 ? (

          /* --- Se mapean los conciertos --- */
          activities.map((item: any) => (

            /* --- Se crea una carta para cada concierto --- */
            <ActivityCard key = {item.id} activity = {item} isBooked = {userBookings.includes(item.id)} onBook = {handleBook} onCancel = {handleCancel}/>

          ))

        ) : (

          /* --- Cuando no hay ningún concierto activo --- */
          <View style = {styles.emptyContainer}>

            {/* --- Icono de música --- */}
            <Ionicons name = "musical-notes-outline" size = {64} color = "rgba(255,255,255,0.1)" />

            {/* --- Texto de que no hay conciertos --- */}
            <Text style = {styles.emptyText}>No concerts available at the moment.</Text>
          
          </View>

        )}

      </ScrollView>

      {/* --- Barra de navegación inferior --- */}
      <UserBottomNav/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1, 
    backgroundColor: Colors.dark.background 

  },

  gradientContainer: { 

    ...StyleSheet.absoluteFillObject, 
    zIndex: -1 

  },

  scrollContent: { 

    padding: 20, 
    paddingBottom: 150 

  },

  header: { 

    marginTop: 70, 
    marginBottom: 24 

  },

  title: { 

    fontSize: 36, 
    fontWeight: "900", 
    color: 'white' 

  },

  subtitle: { 

    fontSize: 16, 
    color: "rgba(255, 255, 255, 0.5)", 
    marginTop: 4 

  },

  emptyContainer: { 

    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 100 

  },

  emptyText: { 

    color: 'rgba(255, 255, 255, 0.3)', 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 

  }
  
});