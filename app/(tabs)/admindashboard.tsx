/* --- Importaciones --- */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "@/services/authService";
import BackgroundEffects from "@/components/BackgroundEffects";
import { Colors } from "@/constants/theme";
import AdminBottomNav from "@/components/AdminBottomNav";

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

/* --- Vista del panel de admin --- */
export default function AdminDashboard() {

  const router = useRouter();

  /* --- Guardar el usuario actual --- */
  const [user, setUser] = useState<any>(null);

  /* --- Guardar las estadísticas de la aplicación --- */
  const [stats, setStats] = useState({totalUsers: 0, activeConcerts: 0, totalBookings: 0, totalCapacity: 0 });

  /* --- Estado de carga --- */
  const [isLoading, setIsLoading] = useState(true);

  /* --- Estado de refresco --- */
  const [refreshing, setRefreshing] = useState(false);

  /* --- Cargar las estadísticas --- */
  const fetchStats = async () => {

    try {

      /* --- Obtener el token de la petición --- */
      const token = authService.getToken();
      const headers = { 'Auth': `Bearer ${token}` };

      /* --- Obtener las estadísticas llamando al backend --- */
      const [usersRes, activitiesRes, bookingsRes] = await Promise.all([

        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/activities`, { headers }),
        fetch(`${API_BASE_URL}/bookings`, { headers })

      ]);

      /* --- Convertir las respuestas a JSON --- */
      const users = await usersRes.json();
      const activities = await activitiesRes.json();
      const bookings = await bookingsRes.json();

      /* --- Si las respuestas son correctas, actualizar las estadísticas --- */
      if (usersRes.ok && activitiesRes.ok && bookingsRes.ok) {

        /* --- Obtener los eventos activos y la capacidad total --- */
        const activeEvents = activities.filter((a: any) => a.state === 'active');
        const capacitySum = activeEvents.reduce((acc: number, curr: any) => acc + (curr.capacity || 0), 0);

        /* --- Actualizar las estadísticas --- */
        setStats({

          totalUsers: users.length,
          activeConcerts: activeEvents.length,
          totalBookings: bookings.length,
          totalCapacity: capacitySum

        });

      }

    } catch (error) {

      /* --- Si hay un error, se devuelve --- */
      console.error("Error fetching admin stats:", error);

    } finally {

      /* --- Las estadísticas ya se han cargado --- */
      setIsLoading(false);
      setRefreshing(false);

    }

  };

  /* --- Cargar las estadísticas al cargar la vista --- */
  useEffect(() => {

    /* --- Obtener el usuario actual --- */
    const currentUser = authService.getCurrentUser();

    /* --- Si el usuario no es admin, se redirige al login --- */
    if (!currentUser || currentUser.role !== 'admin') {

      router.replace("/login");

    } else {

      /* --- Guardar el usuario actual --- */
      setUser(currentUser);

      /* --- Cargar las estadísticas --- */
      fetchStats();

    }

  }, []);

  /* --- Refrescar las estadísticas --- */
  const onRefresh = useCallback(() => {

    /* --- Activar el refresco --- */
    setRefreshing(true);

    /* --- Cargar las estadísticas --- */
    fetchStats();

  }, []);

  /* --- Si las estadísticas no se han cargado, mostrar un indicador de carga --- */
  if (isLoading) {

    return (

      <View style = {styles.loadingContainer}>

        <ActivityIndicator size = "large" color = "#8b5cf6" />

      </View>

    );

  }

  /* --- Colores utilizados repetidamente --- */
  const purpleIconColor = "#a855f7";
  const purpleBgColor = "rgba(168, 85, 247, 0.15)";

  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} style = {styles.gradientContainer} />
      <BackgroundEffects />

      {/* --- Contenedor con scroll para mostrar el contenido de la vista --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} showsVerticalScrollIndicator = {false} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#8b5cf6"/>}>
        
        {/* --- Header --- */}
        <View style = {styles.header}>

          {/* --- Título --- */}
          <Text style = {styles.title}>Overview</Text>

          {/* --- Subtítulo --- */}
          <Text style = {styles.subtitle}>Welcome back, {user?.username}. Here's the festival status.</Text>

        </View>

        {/* --- Sección de estadísticas --- */}
        <View style = {styles.section}>

          {/* --- Título de la sección --- */}
          <Text style = {styles.sectionTitle}>Stats</Text>
          
          {/* --- Grid de estadísticas --- */}
          <View style = {styles.grid}>

            {/* --- Usuarios totales --- */}
            <View style = {styles.card}>

              {/* --- Icono --- */}
              <View style = {[styles.iconWrapper, { backgroundColor: purpleBgColor }]}>

                 <Ionicons name = "people" size = {20} color = {purpleIconColor} />

              </View>

              {/* --- Label --- */}
              <Text style = {styles.cardLabel}>Total Users</Text>

              {/* --- Valor --- */}
              <Text style = {styles.cardValue}>{stats.totalUsers}</Text>

            </View>

            {/* --- Conciertos activos --- */}
            <View style = {styles.card}>

              {/* --- Icono --- */}
              <View style = {[styles.iconWrapper, { backgroundColor: purpleBgColor }]}>

                 <Ionicons name = "musical-notes" size = {20} color = {purpleIconColor} />

              </View>

              {/* --- Label --- */}
              <Text style = {styles.cardLabel}>Active Concerts</Text>

              {/* --- Valor --- */}
              <Text style = {styles.cardValue}>{stats.activeConcerts}</Text>

            </View>

          </View>

          <View style = {[styles.grid, { marginTop: 15 }]}>

            {/* --- Reservas totales --- */}
            <View style = {styles.card}>

              {/* --- Icono --- */}
              <View style = {[styles.iconWrapper, { backgroundColor: purpleBgColor }]}>

                 <Ionicons name = "ticket" size = {20} color = {purpleIconColor} />

              </View>

              {/* --- Label --- */}
              <Text style = {styles.cardLabel}>Total Bookings</Text>

              {/* --- Valor --- */}
              <Text style = {styles.cardValue}>{stats.totalBookings}</Text>

            </View>

            {/* --- Capacidad total --- */}
            <View style = {styles.card}>

              {/* --- Icono --- */}
              <View style = {[styles.iconWrapper, { backgroundColor: purpleBgColor }]}>

                 <Ionicons name = "stats-chart" size = {20} color = {purpleIconColor} />

              </View>

              {/* --- Label --- */}
              <Text style = {styles.cardLabel}>Total Capacity</Text>

              {/* --- Valor --- */}
              <Text style = {styles.cardValue}>{stats.totalCapacity}</Text>

            </View>

          </View>

        </View>

        {/* --- Sección de acciones de acceso rápido --- */}
        <View style = {styles.section}>

          {/* --- Título --- */}
          <Text style = {styles.sectionTitle}>Quick Actions</Text>

          {/* --- Botón que redirige a la vista de gestión de usuarios --- */}
          <TouchableOpacity style = {styles.actionButton} onPress={() => router.push("/adminusers")}>

            <Text style = {styles.actionButtonText}>Manage Users</Text>

          </TouchableOpacity>

          {/* --- Botón que redirige a la vista de gestión de conciertos --- */}
          <TouchableOpacity style = {[styles.actionButton, styles.secondaryAction]} onPress={() => router.push("/adminconcerts")}>

            <Text style = {styles.secondaryButtonText}>Manage Concerts</Text>

          </TouchableOpacity>

        </View>

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

  loadingContainer: {

    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center' 

  },

  gradientContainer: {

    ...StyleSheet.absoluteFillObject, 
    zIndex: -1 

  },

  scrollContent: {

    padding: 25, 
    paddingBottom: 100 

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
    color: "rgba(255, 255, 255, 0.6)", 
    marginTop: 5 

  },

  section: {

    marginBottom: 35 

  },

  sectionTitle: {

    fontSize: 20, 
    fontWeight: "700", 
    color: 'white', 
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
    
    fontSize: 14, 
    color: "rgba(255, 255, 255, 0.5)", 
    marginBottom: 5 

  },

  cardValue: { 
    
    fontSize: 24, 
    fontWeight: "bold", 
    color: 'white' 

  },

  actionButton: { 
    
    backgroundColor: "#8b5cf6", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    marginBottom: 12 

  },

  actionButtonText: { 
    
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "700" 

  },

  secondaryAction: {

    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'

  },

  secondaryButtonText: { 
    
    color: "white", 
    fontSize: 16, 
    fontWeight: "700" 

  }

});