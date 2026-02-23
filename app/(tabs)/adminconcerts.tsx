/* --- Importaciones --- */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "@/services/authService";
import BackgroundEffects from "@/components/BackgroundEffects";
import AdminBottomNav from "@/components/AdminBottomNav";
import ActivityCard from "@/components/ActivityCard";
import AdminConcertModal from "@/components/AdminConcertModal";
import AdminEditConcertModal from "@/components/AdminEditConcertModal";
import AdminAttendeesModal from "@/components/AdminAttendeesModal";
import { Colors } from "@/constants/theme";

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

/* --- Vista de todos los conciertos (admin) --- */
export default function AdminConcerts() {

  /* --- Guardar todos los conciertos --- */
  const [activities, setActivities] = useState([]);

  /* --- Refrescar la vista --- */
  const [refreshing, setRefreshing] = useState(false);
  
  /* --- Controlar la visibilidad de los modales --- */
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isAttendeesVisible, setIsAttendeesVisible] = useState(false);
  
  /* --- Pasar la actividad seleccionada a los modales de edición o asistentes --- */
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  /* --- Cargar todos los conciertos --- */
  const fetchActivities = async () => {

    try {

      /* --- Obtener el token --- */
      const token = authService.getToken();

      /* --- Realizar la petición al backend --- */
      const res = await fetch(`${API_BASE_URL}/activities`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Obtener los datos --- */
      const data = await res.json();
      
      /* --- Si la petición es exitosa --- */
      if (res.ok) {

        /* --- Se ordena por más nuevos primero --- */
        setActivities(data.sort((a: any, b: any) => 

          new Date(b.start).getTime() - new Date(a.start).getTime()

        ));

      }

    } catch (error) {

      /* --- Si salta un error, se devuelve --- */
      console.error("Error fetching admin activities:", error);

    }

  };

  /* --- Cargar los conciertos al iniciar la vista --- */
  useEffect(() => {

    fetchActivities();

  }, []);

  /* --- Refrescar la vista --- */
  const onRefresh = useCallback(() => {

    setRefreshing(true);
    fetchActivities().then(() => setRefreshing(false));

  }, []);

  /* --- Editar un concierto abre el modal de edición de conciertos --- */
  const handleEditPress = (activity: any) => {

    setSelectedActivity(activity);
    setIsEditVisible(true);

  };

  /* --- Ver los asistentes de un concierto abre el modal de asistentes --- */
  const handleAttendeesPress = (activity: any) => {

    setSelectedActivity(activity);
    setIsAttendeesVisible(true);

  };

  /* --- Eliminar un concierto abre un alert para confirmar la eliminación --- */
  const handleDelete = (activity: any) => {
    Alert.alert("Delete Concert", /* --- Título --- */

      /* --- Mensaje --- */
      `Are you sure you want to delete "${activity.name}"? This action cannot be undone.`,

      /* --- Botones --- */
      [

        /* --- Botón de cancelar (simplemente cancela y cierra el alert) --- */
        { text: "Cancel", style: "cancel" },

        /* --- Botón de eliminar --- */
        { 

          text: "Delete", 
          style: "destructive", 

          /* --- Método que se ejecuta al presionar el botón de eliminar --- */
          onPress: async () => {

            try {

              /* --- Obtener el token --- */
              const token = authService.getToken();

              /* --- Petición para eliminar el concierto --- */
              const res = await fetch(`${API_BASE_URL}/activities/${activity.id}`, {

                method: 'DELETE',

                /* --- Enviar el token en la petición --- */
                headers: { 'Auth': `Bearer ${token}` }

              });

              /* --- Si la petición es exitosa --- */
              if (res.ok) {

                /* --- Se muestra un mensaje de éxito --- */
                Alert.alert("Success", "The concert has been deleted.");

                /* --- Se actualiza la lista de conciertos --- */
                fetchActivities();

              }

            } catch (error) {

              /* --- Si salta un error, se devuelve --- */
              console.error("Error deleting concert:", error);

            }

          }

        }

      ]

    );

  };

  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Contenedor con scroll para mostrar los conciertos --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#c084fc" />}>
        
        {/* --- Header --- */}
        <View style = {styles.header}>

          {/* --- Título --- */}
          <Text style = {styles.title}>Manage Concerts</Text>

          {/* --- Subtítulo --- */}
          <Text style = {styles.subtitle}>Manage festival shows</Text>

        </View>

        {/* --- Botón para Crear Concierto --- */}
        <TouchableOpacity style = {styles.createButton} onPress = {() => setIsCreateVisible(true)}>

          <Text style = {styles.createButtonText}>Add New Concert</Text>

        </TouchableOpacity>

        {/* --- Cuando hay una o más reservas --- */}
        {activities.length > 0 ? (

          <View style = {styles.list}>

            {/* --- Se mapean todas las reservas --- */}
            {activities.map((item: any) => (

              /* --- Contenedor de la reserva --- */
              <View key = {item.id} style = {styles.cardWrapper}>

                {/* --- Carta del concierto sin botón de reserva --- */}
                <ActivityCard activity = {item} isAdmin = {true} />

                {/* --- Botones de admin, debajo de cada carta --- */}
                <View style = {styles.adminToolbar}>

                  {/* --- Botón para editar el concierto (abre el modal de edición de conciertos) --- */}
                  <TouchableOpacity style = {styles.toolBtn} onPress = {() => handleEditPress(item)}>

                    <Ionicons name = "create-outline" size = {18} color = "#c084fc" />
                    <Text style = {styles.toolText}>Modify</Text>

                  </TouchableOpacity>

                  {/* --- Botón para ver los asistentes (abre el modal de asistentes) --- */}
                  <TouchableOpacity style = {styles.toolBtn} onPress = {() => handleAttendeesPress(item)}>

                    <Ionicons name = "people-outline" size = {18} color = "white" />
                    <Text style = {styles.toolText}>Attendees</Text>

                  </TouchableOpacity>

                  {/* --- Botón para eliminar el concierto (abre un alert para confirmar la eliminación) --- */}
                  <TouchableOpacity style = {[styles.toolBtn, styles.deleteBtn]} onPress = {() => handleDelete(item)}>

                    <Ionicons name = "trash-outline" size = {18} color = "#ef4444" />

                  </TouchableOpacity>

                </View>

              </View>

            ))}

          </View>

        ) : (

          /* --- Cuando no hay ningún concierto --- */
          <View style = {styles.emptyContainer}>

            {/* --- Icono --- */}
            <Ionicons name = "musical-notes-outline" size = {64} color = "rgba(255,255,255,0.1)" />

            {/* --- Texto de que no hay conciertos --- */}
            <Text style = {styles.emptyText}>No concerts found in the system.</Text>

          </View>

        )}

      </ScrollView>

      {/* --- MODALES --- */}
      
      {/* Modal para Crear Concierto */}
      <AdminConcertModal visible = {isCreateVisible} onClose = {() => setIsCreateVisible(false)} onSuccess = {fetchActivities} />

      {/* Modal para Editar Concierto */}
      <AdminEditConcertModal visible = {isEditVisible} activity = {selectedActivity} onClose = {() => { setIsEditVisible(false); setSelectedActivity(null); }} onSuccess = {fetchActivities} />

      {/* Modal para ver Asistentes */}
      <AdminAttendeesModal visible = {isAttendeesVisible} activity = {selectedActivity} onClose = {() => { setIsAttendeesVisible(false); setSelectedActivity(null); }} />

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
    color: "rgba(255, 255, 255, 0.5)", 
    marginTop: 6 

  },

  createButton: { 

    marginBottom: 30, 
    borderRadius: 16, 
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#8b5cf6',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',

  },

  createButtonText: { 

    color: 'white', 
    fontSize: 16, 
    fontWeight: '700' 

  },

  list: { 

    gap: 20 

  },

  cardWrapper: {

    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(18, 12, 29, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',

  },

  adminToolbar: {

    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10

  },

  toolBtn: {

    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    gap: 8

  },

  toolText: { 

    color: 'white', 
    fontSize: 13, 
    fontWeight: '700' 

  },

  deleteBtn: { 

    flex: 0, 
    width: 55, 
    backgroundColor: 'rgba(239, 68, 68, 0.1)' 

  },

  emptyContainer: { 

    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 80 

  },
  
  emptyText: { 

    color: 'rgba(255, 255, 255, 0.3)', 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16 

  }

});