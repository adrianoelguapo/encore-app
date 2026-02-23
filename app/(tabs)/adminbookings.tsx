/* --- Importaciones --- */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackgroundEffects from "@/components/BackgroundEffects";
import AdminBottomNav from "@/components/AdminBottomNav";
import { Colors } from "@/constants/theme";
import { authService } from '@/services/authService';

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

/* --- Vista de todas las reservas (admin) --- */
export default function AdminBookings() {

  /* --- Guardar todas las reservas --- */
  const [bookings, setBookings] = useState([]);

  /* --- Refrescar la vista --- */
  const [refreshing, setRefreshing] = useState(false);

  /* --- Obtener todas las reservas --- */
  const fetchAllBookings = async () => {

    try {

      /* --- Obtener el token --- */
      const token = authService.getToken();

      /* --- Realizar la petición al backend --- */
      const res = await fetch(`${API_BASE_URL}/bookings`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Convertir la respuesta a JSON --- */
      const data = await res.json();

      /* --- Si la respuesta es correcta --- */
      if (res.ok) {

        /* --- Guardar las reservas ordenadas por fecha --- */
        setBookings(data.sort((a: any, b: any) => 

          new Date(b.booked_at).getTime() - new Date(a.booked_at).getTime()

        ));

      }

    } catch (error) {

      /* --- Si salta un error, se devuelve --- */
      console.error("Error fetching global bookings:", error);

    }

  };

  /* --- Obtener todas las reservas al cargar la vista --- */
  useEffect(() => { fetchAllBookings(); }, []);

  /* --- Actualizar la lista de reservas al refrescar --- */
  const onRefresh = useCallback(() => {

    setRefreshing(true);
    fetchAllBookings().then(() => setRefreshing(false));

  }, []);

  /* --- Formatear la fecha --- */
  const formatDate = (dateString: string) => {

    return new Date(dateString).toLocaleDateString('es-ES', { 

      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', 
      timeZone: 'Europe/Madrid' 

    });

  };

  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Contenedor con scroll para mostrar las reservas --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#c084fc"/>}>
        
        {/* --- Header --- */}
        <View style = {styles.header}>

          {/* --- Título --- */}
          <Text style = {styles.title}>Bookings</Text>

          {/* --- Subtítulo --- */}
          <Text style = {styles.subtitle}>Manage festival bookings</Text>

        </View>

        {/* --- Cuando hay una o más reservas --- */}
        {bookings.length > 0 ? (

          /* --- Mapeo de cada reserva para poder mostrarla --- */
          bookings.map((booking: any, index) => (

            /* --- Carta de la reserva --- */
            <View key = {index} style = {styles.logCard}>

              {/* --- Main de la reserva --- */}
              <View style = {styles.logMain}>

                {/* --- Info del usuario --- */}
                <View style = {styles.userRow}>

                  {/* --- Nombre del usuario --- */}
                  <Text style = {styles.userName}>{booking.user_name}</Text>

                  {/* --- Username del usuario --- */}
                  <Text style = {styles.userTag}>@{booking.username}</Text>

                </View>

                {/* --- Nombre del concierto --- */}
                <Text style = {styles.activityTitle}>{booking.activity_name}</Text>

                {/* --- Fecha de la reserva --- */}
                <Text style = {styles.logDate}>{formatDate(booking.booked_at || booking.activity_start)}</Text>

              </View>

              {/* --- Estado de la reserva --- */}
              <View style = {[styles.statusBadge, booking.activity_state === 'assist' ? styles.statusAssist : styles.statusCancel]}>

                {/* --- Texto del estado --- */}
                <Text style = {[styles.statusText, { color: booking.activity_state === 'assist' ? '#34d399' : '#ef4444' }]}>

                  {booking.activity_state.toUpperCase()}

                </Text>

              </View>

            </View>

          ))

        ) : (

          /* --- Cuando no hay ninguna reserva --- */
          <View style = {styles.emptyContainer}>

            {/* --- Icono --- */}
            <Ionicons name = "ticket-outline" size = {64} color = "rgba(255,255,255,0.1)" />

            {/* --- Texto de que no hay reservas --- */}
            <Text style = {styles.emptyText}>No bookings recorded yet.</Text>

          </View>

        )}

      </ScrollView>

      {/* --- Barra de navegación (admin) --- */}
      <AdminBottomNav/>

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

    padding: 25, 
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
    color: "rgba(255, 255, 255, 0.5)" 

  },

  logCard: {

    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'

  },

  logMain: { 

    flex: 1 

  },

  userRow: { 

    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginBottom: 4 

  },

  userName: { 

    color: 'white', 
    fontWeight: '700', 
    fontSize: 15 

  },

  userTag: { 

    color: 'rgba(255,255,255,0.4)', 
    fontSize: 12 

  },

  activityTitle: { 

    color: '#c4b5fd', 
    fontSize: 14, 
    fontWeight: '600' 

  },

  logDate: { 

    color: 'rgba(255,255,255,0.25)', 
    fontSize: 11, 
    marginTop: 4 

  },

  statusBadge: { 

    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 8, 
    borderWidth: 1 

  },

  statusAssist: { 

    backgroundColor: 'rgba(52, 211, 153, 0.1)', 
    borderColor: 'rgba(52, 211, 153, 0.3)' 

  },

  statusCancel: { 

    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    borderColor: 'rgba(239, 68, 68, 0.3)' 

  },

  statusText: { 

    fontSize: 10, 
    fontWeight: '800' 

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