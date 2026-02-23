/* --- Importaciones --- */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { authService } from "@/services/authService";
import BackgroundEffects from "@/components/BackgroundEffects";
import { Colors } from "@/constants/theme";
import UserBottomNav from "@/components/UserBottomNav";
import { Ionicons } from "@expo/vector-icons";

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

export default function Dashboard() {

  /* --- Instancia del router para la navegación --- */
  const router = useRouter();

  /* --- Almacenar el usuario --- */
  const [user, setUser] = useState<any>(null);

  /* --- Almacenar las estadísticas --- */
  const [stats, setStats] = useState({

    totalBookings: 0,
    nextConcert: "No upcoming concerts"

  });

  /* --- Estado para indicar si se está actualizando la vista --- */
  const [refreshing, setRefreshing] = useState(false);

  /* --- Método para obtener los datos del dashboard --- */
  const fetchDashboardData = async () => {

    try {

      /* --- Obtener el usuario actual --- */
      const currentUser = authService.getCurrentUser();

      /* --- Si no hay usuario, redirigir al login --- */
      if (!currentUser) {

        router.replace("/login");
        return;

      }

      /* --- Almacenar el usuario --- */
      setUser(currentUser);

      /* --- Obtener el token --- */
      const token = authService.getToken();

      /* --- Realizar la petición al backend para obtener las reservas del usuario --- */
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/bookings`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Convertir la respuesta a JSON --- */
      const bookings = await response.json();

      /* --- Si la respuesta es exitosa --- */
      if (response.ok) {

        /* --- Filtrar reservas activas --- */
        const activeBookings = bookings.filter((b: any) => b.activity_state === 'assist');
        
        /* --- Encontrar el concierto más próximo a la fecha actual --- */
        const now = new Date();
        const futureConcerts = activeBookings.map((b: any) => ({ ...b, startDate: new Date(b.activity_start) })).filter((b: any) => b.startDate > now).sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime());

        /* --- Actualizar las estadísticas de la vista --- */
        setStats({

          totalBookings: activeBookings.length,
          nextConcert: futureConcerts.length > 0 ? futureConcerts[0].activity_name : "None"

        });

      }

    } catch (error) {

      /* --- Si salta un error, se devuelve --- */
      console.error("Error loading dashboard data:", error);

    }

  };

  /* --- Obtener datos de las estadísticas al cargar la vista */
  useEffect(() => {

    fetchDashboardData();

  }, []);

  /* --- Actualizar los datos de las estadísticas al refrescar la vista --- */
  const onRefresh = useCallback(() => {

    setRefreshing(true);
    fetchDashboardData().then(() => setRefreshing(false));

  }, []);

  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} start = {{ x: 0.5, y: 0 }} end = {{ x: 0.5, y: 1 }} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Contenedor con scroll para mostrar el contenido de la vista --- */}
      <ScrollView contentContainerStyle = {[styles.scrollContent, { paddingBottom: 150 }]} showsVerticalScrollIndicator = {false} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#8b5cf6"/>}>

        {/* --- Header --- */}
        <View style = {styles.header}>

          {/* --- Título --- */}
          <Text style = {styles.title}>Home</Text>

          {/* --- Subtítulo --- */}
          <Text style = {styles.subtitle}>Welcome back, {user?.username || 'User'}</Text>

        </View>

        {/* --- Sección de estadísticas --- */}
        <View style = {styles.section}>

          {/* --- Título --- */}
          <Text style = {styles.sectionTitle}>Overview</Text>

          {/* --- Grid de estadísticas --- */}
          <View style = {styles.grid}>
            
            {/* --- Contador de reservas --- */}
            <View style = {styles.card}>

              {/* --- Icono --- */}
              <View style = {[styles.iconWrapper, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>

                 <Ionicons name = "ticket" size = {20} color = "#c4b5fd"/>

              </View>

              {/* --- Información --- */}
              <View>

                {/* --- Label --- */}
                <Text style = {styles.cardLabel}>My Bookings</Text>

                {/* --- Valor --- */}
                <Text style = {styles.cardValue}>{stats.totalBookings}</Text>

              </View>

            </View>

            {/* --- Próximo concierto --- */}
            <View style = {styles.card}>

              {/* --- Icono --- */}
              <View style = {[styles.iconWrapper, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>

                 <Ionicons name = "calendar" size = {20} color = "#f9a8d4"/>

              </View>

              {/* --- Información --- */}
              <View>

                {/* --- Label --- */}
                <Text style = {styles.cardLabel}>Next Concert</Text>

                {/* --- Valor --- */}
                <Text style = {styles.cardValue} numberOfLines = {1}>{stats.nextConcert}</Text>

              </View>

            </View>

          </View>

        </View>

        {/* --- Sección de acciones de acceso rápido --- */}
        <View style = {styles.section}>

          {/* --- Título --- */}
          <Text style = {styles.sectionTitle}>Quick Actions</Text>

          {/* --- Botón que redirige a la vista de conciertos --- */}
          <TouchableOpacity style = {styles.actionButton} onPress = {() => router.push("/concerts")}>
            
            <Text style = {styles.actionButtonText}>Browse Concerts</Text>
            
          </TouchableOpacity>

          {/* --- Botón que redirige a la vista de reservas --- */}
          <TouchableOpacity style = {[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }]} onPress = {() => router.push("/bookings")}>
            
            <Text style = {styles.actionButtonText}>Check My Bookings</Text>
            
          </TouchableOpacity>
          
        </View>

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

    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    zIndex: -1 

  },

  scrollContent: { 

    padding: 25 

  },

  header: { 

    marginTop: 70, 
    marginBottom: 30

  },

  title: { 

    fontSize: 36, 
    fontWeight: "900", 
    color: Colors.dark.text, 
    letterSpacing: -1 

  },

  subtitle: { 

    fontSize: 16, 
    color: "rgba(255, 255, 255, 0.6)", 
    marginTop: 5 

  },

  section: { 
    
    marginBottom: 35 

  },

  sectionTitle: { 
    
    fontSize: 20, 
    fontWeight: "700", 
    color: Colors.dark.text, 
    marginBottom: 20 

  },

  grid: { 
    
    flexDirection: "row", 
    justifyContent: "space-between", 
    gap: 15 

  },

  card: { 
    
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.1)",

  },

  iconWrapper: { 

    width: 40, 
    height: 40, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 15 

  },

  cardLabel: { 
    
    fontSize: 13, 
    color: "rgba(255, 255, 255, 0.5)", 
    marginBottom: 5, 
    fontWeight: '600' 

  },

  cardValue: { 
    
    fontSize: 18, 
    fontWeight: "bold", 
    color: Colors.dark.text 

  },

  actionButton: { 
    
    backgroundColor: "#8b5cf6", 
    padding: 18, 
    borderRadius: 14, 
    flexDirection: 'row',
    alignItems: "center", 
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4

  },

  actionButtonText: { 
    
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "700" 

  }

});