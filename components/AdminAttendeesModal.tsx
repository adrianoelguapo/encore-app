import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/authService';

const API_BASE_URL = 'http://172.20.10.3:5000/api';

export default function AdminAttendeesModal({ visible, onClose, activity }: any) {

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (visible && activity) {

      fetchAttendees();

    }

  }, [visible, activity]);

  const fetchAttendees = async () => {

    setLoading(true);

    try {

      const token = authService.getToken();

      const res = await fetch(`${API_BASE_URL}/bookings`, {

        headers: { 'Auth': `Bearer ${token}` }

      });

      const data = await res.json();
      
      if (res.ok) {

        const filtered = data.filter((b: any) => 

          b.activity_id === activity.id && b.activity_state === 'assist'

        );

        setAttendees(filtered);

      }

    } catch (error) {

      console.error("Error fetching attendees:", error);

    } finally {

      setLoading(false);

    }

  };

  const handleCancelBooking = (attendee: any) => {
    Alert.alert("Cancel Booking",

      `Are you sure you want to cancel the booking for ${attendee.user_name}?`,

      [

        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",

          onPress: async () => {

            try {

              const token = authService.getToken();

              const res = await fetch(`${API_BASE_URL}/users/${attendee.user_id}/bookings/${attendee.activity_id}`, {

                method: 'DELETE',
                headers: { 'Auth': `Bearer ${token}` }

              });
              
              if (res.ok) {

                Alert.alert("Success", "Booking cancelled successfully");
                fetchAttendees(); // Refrescamos la lista

              } else {

                Alert.alert("Error", "Booking could not be cancelled");

              }

            } catch (error) {

              Alert.alert("Error", "Connection error");

            }

          }

        }

      ]

    );
    
  };

  return (

    <Modal visible = {visible} animationType = "slide" transparent>

      <BlurView intensity = {100} tint = "dark" style = {styles.modalOverlay}>

        <View style = {styles.modalContainer}>

          <View style = {styles.modalHeader}>

            <View style = {styles.headerTextContainer}>

              <Text style = {styles.modalTitle}>Attendees List</Text>
              <Text style = {styles.modalSubtitle} numberOfLines = {1}>{activity?.name}</Text>

            </View>

            <TouchableOpacity onPress = {onClose} style = {styles.closeBtn}>

              <Ionicons name = "close" size = {28} color = "white" />

            </TouchableOpacity>

          </View>

          {loading ? (

            <View style = {styles.centerContent}>

              <ActivityIndicator size = "large" color = "#8b5cf6" />

            </View>

          ) : (

            <ScrollView style = {styles.modalBody} showsVerticalScrollIndicator = {false}>

              {attendees.length > 0 ? (

                attendees.map((attendee: any, index) => (

                  <View key = {index} style = {styles.attendeeCard}>

                    <View style = {styles.userInfo}>

                      <Text style = {styles.userName} numberOfLines = {1}>{attendee.user_name}</Text>
                      <Text style = {styles.userHandle}>@{attendee.username}</Text>

                    </View>
                    
                    <View style = {styles.actionsContainer}>

                      <Text style = {styles.statusText}>

                        {attendee.activity_state.toUpperCase()}
                        
                      </Text>
                      
                      <TouchableOpacity style = {styles.cancelBtn} onPress = {() => handleCancelBooking(attendee)}>

                        <Ionicons name = "trash-outline" size = {18} color = "#ef4444" />

                      </TouchableOpacity>
                      
                    </View>

                  </View>

                ))

              ) : (

                <View style = {styles.emptyContainer}>

                  <Ionicons name = "people-outline" size = {64} color = "rgba(255,255,255,0.1)" />
                  <Text style = {styles.emptyText}>No confirmed attendees for this activity.</Text>

                </View>

              )}

            </ScrollView>

          )}

          <TouchableOpacity style = {styles.closeFooterBtn} onPress = {onClose}>

            <Text style = {styles.closeFooterText}>Close List</Text>

          </TouchableOpacity>

        </View>

      </BlurView>

    </Modal>

  );

}

/* --- Estilos del componente --- */
const styles = StyleSheet.create({

  modalOverlay: {

    flex: 1, 
    justifyContent: 'flex-end' 

  },

  modalContainer: { 

    backgroundColor: '#0a0015', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    height: '85%', 
    padding: 24, 
    borderTopWidth: 1, 
    borderColor: 'rgba(139, 92, 246, 0.3)' 

  },
  
  modalHeader: { 

    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 30 

  },

  headerTextContainer: {

    flex: 1, 
    paddingRight: 10 

  },

  modalTitle: {

    color: 'white', 
    fontSize: 24, 
    fontWeight: '900' 

  },

  modalSubtitle: {

    color: '#8b5cf6', 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 4 

  },

  closeBtn: {

    padding: 4 

  },

  modalBody: {

    flex: 1 

  },

  centerContent: {

    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
    
  },

  attendeeCard: { 

    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'

  },

  userInfo: {

    flex: 1 

  },

  userName: {

    color: 'white', 
    fontWeight: '700', 
    fontSize: 17 

  },

  userHandle: {

    color: 'rgba(139, 92, 246, 0.5)', 
    fontSize: 14, 
    marginTop: 2 

  },

  actionsContainer: { 

    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15 

  },

  statusText: { 

    color: 'white', 
    fontSize: 11, 
    fontWeight: '800',
    opacity: 0.8

  },

  cancelBtn: {

    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'

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
    
  },

  closeFooterBtn: { 

    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 30

  },

  closeFooterText: {

    color: 'white', 
    fontWeight: '700', 
    fontSize: 16 

  }

});