/* --- Importaciones --- */
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api'; 

/* --- Componente para cada carta de cada concierto --- */
export default function ActivityCard({ activity, isBooked, onBook, onCancel, isAdmin }: any) {

  /* --- Cálculo del porcentaje de la barra de ocupación con una regla de tres --- */
  const usersCount = activity.users ? activity.users.length : 0;
  const occupancyPercent = Math.min((usersCount / activity.capacity) * 100, 100);

  /* --- Saber si el concierto está lleno o terminado --- */
  const isFull = usersCount >= activity.capacity;
  const isFinished = activity.state === 'finished';

  /* --- Formateo de fechas y horas --- */
  const formatDate = (dateString: string) => {

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

  };

  const formatTime = (dateString: string) => {

    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  };

  /* --- Imagen del concierto --- */
  const imageUrl = activity.image ? { uri: `${API_BASE_URL.replace('/api', '')}/static/images/${activity.image}` } : { uri: 'https://via.placeholder.com/400x250?text=No+Image' };

  return (

    /* --- Contenedor principal de la carta del concierto --- */
    <View style = {styles.card}>

      {/* --- Header --- */}
      <View style = {styles.header}>

        {/* --- Imagen del concierto --- */}
        <Image source = {imageUrl} style = {styles.image} />

        {/* --- Capa que oscurece la imagen --- */}
        <LinearGradient colors = {['transparent', 'rgba(18, 12, 29, 0.8)']} style = {styles.overlay}/>

      </View>

      {/* --- Cuerpo de la carta del concierto --- */}
      <View style = {styles.body}>

        {/* --- Título --- */}
        <Text style = {styles.title} numberOfLines = {1}>{activity.name}</Text>

        {/* --- Descripción --- */}
        <Text style = {styles.description} numberOfLines = {2}>{activity.description}</Text>

        {/* --- Contenedor para más datos --- */}
        <View style = {styles.metrics}>

          {/* --- Fecha y hora --- */}
          <Text style = {styles.label}>DATE & TIME</Text>
          <Text style = {styles.value}>{formatDate(activity.start)} • {formatTime(activity.start)} - {formatTime(activity.finish)}</Text>
          
          {/* --- Porcentaje de ocupación y plazas sobrantes --- */}
          <View style = {styles.occupancyContainer}>

            <Text style = {styles.label}>OCCUPANCY ({usersCount}/{activity.capacity})</Text>

            <View style = {styles.progressBar}>

              <View style = {[styles.progressFill, { width: `${occupancyPercent}%` }]} />

            </View>

          </View>
          
        </View>

        {/* --- Contenedor para el botón de la carta --- */}
        <View style = {styles.buttonContainer}>

          {/* --- Si el concierto ha terminado --- */}
          {isFinished ? (

            /* --- El botón se deshabilita y muestra que el concierto ya ha terminado --- */
            <View style = {styles.finishedBtn}><Text style = {styles.finishedText}>FINISHED</Text></View>

          ) : isBooked ? (

            /* --- Si el usuario ya tiene una reserva en ese concierto, se muestra un botón para cancelar --- */
            <TouchableOpacity style = {styles.cancelBtn} onPress = {() => onCancel(activity)}>

              <Text style = {styles.cancelText}>Cancel Reservation</Text>

            </TouchableOpacity>

          ) : (

            /* --- Si el usuario no tiene una reserva en ese concierto y no es administrador, se muestra un botón para reservar --- */
            !isAdmin && (

              <TouchableOpacity style = {[styles.bookBtn, isFull && styles.disabledBtn]} onPress = {() => onBook(activity)} disabled = {isFull}>

                <Text style = {styles.bookText}>{isFull ? 'Activity Full' : 'Book Now'}</Text>

              </TouchableOpacity>

            )

          )}

        </View>

      </View>

    </View>

  );

}

/* --- Estilos del componente --- */
const styles = StyleSheet.create({

  card: {

    backgroundColor: '#120c1d', 
    borderRadius: 24, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(139, 92, 246, 0.2)', 
    overflow: 'hidden' 

  },

  header: {

    height: 160, 
    width: '100%' 

  },

  image: {

    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 

  },

  overlay: {

    ...StyleSheet.absoluteFillObject 
  },

  body: {

    padding: 16 
  },

  title: {

    color: 'white', 
    fontSize: 20, 
    fontWeight: '800', 
    marginBottom: 4 

  },

  description: {

    color: 'rgba(255, 255, 255, 0.5)', 
    fontSize: 13, 
    marginBottom: 12 

  },

  metrics: {

    gap: 8 

  },

  label: {

    color: 'rgba(139, 92, 246, 0.8)', 
    fontSize: 10, 
    fontWeight: '700', 
    letterSpacing: 1 

  },

  value: {

    color: 'white', 
    fontSize: 14, 
    fontWeight: '500' 

  },

  occupancyContainer: {

    marginTop: 4 

  },

  progressBar: {

    height: 4, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 2, 
    marginTop: 4 

  },

  progressFill: {

    height: '100%', 
    backgroundColor: '#8b5cf6', 
    borderRadius: 2 

  },

  buttonContainer: {

    marginTop: 16 

  },

  bookBtn: {

    backgroundColor: '#8b5cf6', 
    padding: 14, 
    borderRadius: 12, 
    alignItems: 'center' 

  },

  bookText: {

    color: 'white', 
    fontWeight: '700' 

  },

  cancelBtn: {

    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(239, 68, 68, 0.3)', 
    padding: 14, 
    borderRadius: 12, 
    alignItems: 'center' 

  },

  cancelText: {

    color: '#ef4444', 
    fontWeight: '700' 

  },

  finishedBtn: {

    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    padding: 14, 
    borderRadius: 12, 
    alignItems: 'center' 

  },

  finishedText: {

    color: 'rgba(255, 255, 255, 0.4)', 
    fontWeight: '700' 

  },

  disabledBtn: {

    opacity: 0.5 

  }

});