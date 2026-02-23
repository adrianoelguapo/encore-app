import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/authService';

const API_BASE_URL = 'http://172.20.10.3:5000/api';

export default function AdminUserEditModal({ visible, onClose, onSuccess, user }: any) {

  const [form, setForm] = useState({ name: '', username: '', password: '' });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (user && visible) {

      setForm({

        name: user.name || '',
        username: user.username || '',
        password: ''

      });

    }

  }, [user, visible]);

  const handleUpdate = async () => {

    setLoading(true);

    try {

      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {

        method: 'PUT',

        headers: {

          'Content-Type': 'application/json',
          'Auth': `Bearer ${token}`

        },

        body: JSON.stringify(form)

      });

      const data = await response.json();

      if (response.ok) {

        Alert.alert("Success", "User updated successfully");
        onSuccess();
        onClose();

      } else {

        throw new Error(data.error || "Error updating user");
      }
    } catch (error: any) {

      Alert.alert("Error", error.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <Modal visible = {visible} animationType = "slide" transparent>

      <BlurView intensity = {100} tint = "dark" style = {styles.modalOverlay}>

        <View style = {styles.modalContainer}>

          <View style = {styles.modalHeader}>

            <Text style = {styles.modalTitle}>Edit Member</Text>

            <TouchableOpacity onPress = {onClose}>

              <Ionicons name = "close" size = {28} color = "white" />

            </TouchableOpacity>

          </View>

          <ScrollView style = {styles.modalBody} showsVerticalScrollIndicator = {false}>

            <Text style = {styles.sectionLabel}>PERSONAL INFORMATION</Text>
            
            <View style = {styles.inputGroup}>

              <Text style = {styles.fieldLabel}>Full Name</Text>
              <TextInput style = {styles.input} value = {form.name} onChangeText = {(t) => setForm({...form, name: t})} placeholder = "Full Name" placeholderTextColor = "#444"/>
            
            </View>

            <View style = {styles.inputGroup}>

              <Text style = {styles.fieldLabel}>Username</Text>
              <TextInput style = {styles.input} value = {form.username} onChangeText = {(t) => setForm({...form, username: t})} placeholder = "Username" placeholderTextColor = "#444"/>
            
            </View>

            <Text style = {[styles.sectionLabel, { marginTop: 20 }]}>SECURITY</Text>

            <View style = {styles.inputGroup}>

              <Text style = {styles.fieldLabel}>Confirm/New Password</Text>
              <TextInput style = {styles.input} value = {form.password} onChangeText = {(t) => setForm({...form, password: t})} secureTextEntry placeholder = "••••••••" placeholderTextColor = "#444"/>
            
            </View>

          </ScrollView>

          <View style = {styles.modalFooter}>

            <TouchableOpacity style = {styles.cancelBtn} onPress = {onClose}>

              <Text style = {styles.cancelText}>Cancel</Text>

            </TouchableOpacity>

            <TouchableOpacity style = {styles.submitBtn} onPress = {handleUpdate} disabled = {loading}>

              {loading ? (

                <ActivityIndicator color = "white" />

              ) : (

                <Text style = {styles.submitText}>Save Changes</Text>

              )}

            </TouchableOpacity>

          </View>

        </View>

      </BlurView>

    </Modal>

  );

}

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
    alignItems: 'center',
    marginBottom: 25

  },

  modalTitle: {

    color: 'white',
    fontSize: 24,
    fontWeight: '900'

  },

  modalBody: {

    flex: 1

  },

  sectionLabel: {

    color: '#c4b5fd',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 15

  },

  fieldLabel: {

    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 8

  },

  inputGroup: {

    marginBottom: 18

  },

  input: { 

    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 12, 
    padding: 15, 
    color: 'white', 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 

  },

  modalFooter: {

    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingBottom: 30

  },

  cancelBtn: {

    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)'

  },

  cancelText: {

    color: 'white',
    fontWeight: '700'

  },

  submitBtn: {

    flex: 2,
    padding: 16,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#8b5cf6'

  },

  submitText: {

    color: 'white',
    fontWeight: '800'

  }

});