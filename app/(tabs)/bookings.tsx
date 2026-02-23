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

/* --- URL de la API -- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

/* --- Vista de las reservas del usuario --- */
export default function Bookings() {

  /* --- Guardar las reservas del usuario --- */
  const [myBookedActivities, setMyBookedActivities] = useState([]);

  /* --- Cuando se refresca la pantalla, se guarda el estado --- */
  const [refreshing, setRefreshing] = useState(false);

  /* --- Guardar el usuario actual --- */
  const user = authService.getCurrentUser();

  /* --- Método para obtener los datos de las reservas del usuario --- */
  const fetchData = async () => {

    try {

      /* --- Obtener el token del usuario --- */
      const token = authService.getToken();
      
      /* --- Realizar la petición al backend para obtener todos los conciertos (sacar imagen y plazas) --- */
      const activitiesRes = await fetch(`${API_BASE_URL}/activities`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Convertir la respuesta en JSON --- */
      const allActivities = await activitiesRes.json();

      /* --- Realizar la petición al backend para obtener las reservas del usuario --- */
      const bookingsRes = await fetch(`${API_BASE_URL}/users/${user.id}/bookings`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Convertir la respuesta en JSON --- */
      const userBookings = await bookingsRes.json();

      /* --- Si las peticiones son exitosas --- */
      if (activitiesRes.ok && bookingsRes.ok) {
        
        /* --- Filtrar el array de conciertos para quedarse solo con los que el usuario ha reservado. --- */
        /* --- Además, adjuntar el estado de la reserva (por si es 'no assist') --- */
        const enrichedBookings = allActivities.filter((activity: any) =>

          userBookings.some((b: any) => b.activity_id === activity.id)

        ).map((activity: any) => {

          const bookingInfo = userBookings.find((b: any) => b.activity_id === activity.id);

          return {

            ...activity,
            booking_state: bookingInfo.activity_state

          };

        });

        /* --- Actualizar el estado con los datos obtenidos --- */
        setMyBookedActivities(enrichedBookings);
      }
    } catch (error) {

      /* --- Si salta un error, se devuelve --- */
      console.error("Error fetching bookings data:", error);

    }

  };

  /* --- Cuando se carga la vista, también se cargan las reservas del usuario --- */
  useEffect(() => {
    fetchData();
  }, []);

  /* --- Cuando se refresca la vista, se vuelven a cargar las reservas del usuario --- */
  const onRefresh = useCallback(() => {

    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));

  }, []);

  /* --- Método para cancelar una reserva (abre un alert de confirmación) --- */
  const handleCancel = async (activity: any) => {
    Alert.alert("Cancel Reservation", /* --- Título --- */

      /* --- Mensaje --- */
      "Are you sure you want to cancel this booking? If there are less than 15 minutes left, it will be marked as 'No Assist'.", 

      /* --- Botones --- */
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",

          /* --- Método que se ejecuta al pulsar el botón de confirmar la cancelación --- */
          onPress: async () => {

            try {

              /* --- Obtener el token del usuario --- */
              const token = authService.getToken();

              /* --- Realizar la petición al backend para cancelar la reserva --- */

              const res = await fetch(`${API_BASE_URL}/users/${user.id}/bookings/${activity.id}`, {

                method: 'DELETE',

                /* --- Enviar el token en la petición --- */
                headers: { 'Auth': `Bearer ${token}` }
              });
              
              /* --- Si la petición es exitosa --- */
              if (res.ok) {

                /* --- Mostrar mensaje de éxito --- */
                Alert.alert("Success", "Action processed successfully");

                /* --- Recargar las reservas --- */
                fetchData();
              }
            } catch (error: any) {

              /* --- Si salta un error, se devuelve --- */
              Alert.alert("Error", "Could not process cancellation");

            }

          }
          
        }

      ]

    );

  };

  return (

    /* --- Contenedor principal de la vista de reservas --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Contenedor con scroll para mostrar las reservas --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#8b5cf6"/>}>

        {/* --- Header --- */}
        <View style = {styles.header}>

          <Text style = {styles.title}>My Bookings</Text>
          <Text style = {styles.subtitle}>Your personal festival schedule</Text>
        
        </View>

        {/* --- Si el usuario tiene reservas, se muestran las cartas de los conciertos --- */}
        {myBookedActivities.length > 0 ? (

          /* --- Se mapean las reservas y se muestra una carta por cada una --- */
          myBookedActivities.map((activity: any) => (

            /* --- Contenedor de la carta de cada reserva --- */
            <View key = {activity.id} style = {styles.cardWrapper}>

              {/* --- Carta de la reserva --- */}
              <ActivityCard activity = {activity} isBooked = {activity.booking_state === 'assist'} onCancel = {handleCancel}/>
              
              {/* --- Si el estado es 'no assist', se muestra un aviso extra sobre la carta --- */}
              {activity.booking_state === 'no assist' && (

                /* --- Aviso de no asistencia --- */
                <View style = {styles.noAssistBadge}>

                  <Ionicons name = "warning" size = {14} color = "#ef4444" />
                  <Text style = {styles.noAssistText}>PENALIZED: NO ASSIST</Text>

                </View>

              )}

            </View>

          ))

        ) : (

          /* --- Cuando no hay ninguna reserva --- */
          <View style = {styles.emptyContainer}>

            {/* --- Icono --- */}
            <Ionicons name = "ticket-outline" size = {64} color = "rgba(255,255,255,0.1)" />
            
            {/* --- Texto de que no hay reservas --- */}
            <Text style = {styles.emptyText}>You haven't booked any concerts yet.</Text>

          </View>

        )}

      </ScrollView>

      <UserBottomNav/>

    </View>
  );
}

/* --- Estilos de la vista --- */
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
    marginBottom: 30 

  },

  title: { 

    fontSize: 36, 
    fontWeight: "900", 
    color: 'white', 
    letterSpacing: -1 

  },

  subtitle: {

    fontSize: 16, 
    color: "rgba(255, 255, 255, 0.5)", 
    marginTop: 6 

  },

  cardWrapper: {
    
    position: 'relative', 
    marginBottom: 5 

  },

  noAssistBadge: {

    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#ef4444',
    zIndex: 10

  },

  noAssistText: { 

    color: '#ef4444', 
    fontSize: 10, 
    fontWeight: '900' 

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