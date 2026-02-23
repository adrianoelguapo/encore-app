import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authService } from '@/services/authService';

const API_BASE_URL = 'http://172.20.10.3:5000/api';

export default function AdminEditConcertModal({ visible, onClose, onSuccess, activity }: any) {

  const [form, setForm] = useState({ name: '', description: '', capacity: '' });

  const [startDate, setStartDate] = useState(new Date());

  const [finishDate, setFinishDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState<'start' | 'finish' | null>(null);

  const [mode, setMode] = useState<'date' | 'time'>('date');

  const [image, setImage] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (activity && visible) {

      setForm({

        name: activity.name,
        description: activity.description,
        capacity: activity.capacity.toString(),

      });

      setStartDate(new Date(activity.start));
      setFinishDate(new Date(activity.finish));
      setImage(null);

    }

  }, [activity, visible]);

  const onChangeDate = (event: any, selectedDate?: Date) => {

    if (Platform.OS === 'android') setShowPicker(null);

    const currentDate = selectedDate || (showPicker === 'start' ? startDate : finishDate);

    if (showPicker === 'start') setStartDate(currentDate);

    else setFinishDate(currentDate);

  };

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({

      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,

    });

    if (!result.canceled) setImage(result.assets[0]);

  };

  const handleUpdate = async () => {

    setLoading(true);

    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('capacity', form.capacity);
    formData.append('start', startDate.toISOString());
    formData.append('finish', finishDate.toISOString());

    if (image) {

      const uriParts = image.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {

        uri: image.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,

      } as any);

    }

    try {

      const token = authService.getToken();

      const response = await fetch(`${API_BASE_URL}/activities/${activity.id}`, {

        method: 'PUT',

        headers: {

          'Auth': `Bearer ${token}`,
          'Accept': 'application/json',

        },

        body: formData,

      });

      if (response.ok) {

        Alert.alert("Éxito", "Concierto actualizado correctamente");
        onSuccess();
        onClose();

      } else {

        const data = await response.json();
        Alert.alert("Error", data.error || "No se pudo actualizar el concierto");

      }

    } catch (error) {

      Alert.alert("Error", "Error al conectar con el servidor");

    } finally {

      setLoading(false);

    }

  };

  return (
    
    <Modal visible = {visible} animationType = "slide" transparent>

      <BlurView intensity = {100} tint = "dark" style = {styles.modalOverlay}>

        <View style = {styles.modalContainer}>

          <View style = {styles.modalHeader}>

            <Text style = {styles.modalTitle}>Edit Concert</Text>
            <TouchableOpacity onPress = {onClose}><Ionicons name = "close" size = {28} color = "white"/></TouchableOpacity>

          </View>

          <ScrollView style = {styles.modalBody} showsVerticalScrollIndicator = {false}>

            <Text style = {styles.label}>EVENT NAME</Text>
            <TextInput style = {styles.input} value = {form.name} onChangeText = {(t) => setForm({...form, name: t})}/>

            <Text style = {styles.label}>DESCRIPTION</Text>
            <TextInput style = {[styles.input, styles.textArea]} multiline value = {form.description} onChangeText = {(t) => setForm({...form, description: t})}/>

            <Text style = {styles.label}>CAPACITY</Text>
            <TextInput style = {styles.input} keyboardType = "numeric" value = {form.capacity} onChangeText = {(t) => setForm({...form, capacity: t})}/>

            <Text style = {styles.label}>SCHEDULE</Text>
            <View style = {styles.dateTimeContainer}>

               <View style = {styles.buttonRow}>

                 <TouchableOpacity style = {styles.pickerBtn} onPress = {() => {setShowPicker('start'); setMode('date')}}>

                   <Text style = {styles.pickerBtnText}>Starts: {startDate.toLocaleDateString()}</Text>

                 </TouchableOpacity>

                 <TouchableOpacity style = {styles.pickerBtn} onPress = {() => {setShowPicker('start'); setMode('time')}}>

                   <Text style = {styles.pickerBtnText}>{startDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>

                 </TouchableOpacity>

               </View>

               <View style = {styles.buttonRow}>

                 <TouchableOpacity style = {styles.pickerBtn} onPress = {() => {setShowPicker('finish'); setMode('date')}}>

                   <Text style = {styles.pickerBtnText}>Ends: {finishDate.toLocaleDateString()}</Text>

                 </TouchableOpacity>

                 <TouchableOpacity style = {styles.pickerBtn} onPress = {() => {setShowPicker('finish'); setMode('time')}}>

                   <Text style = {styles.pickerBtnText}>{finishDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</Text>

                 </TouchableOpacity>

               </View>

            </View>

            {showPicker && (

              <DateTimePicker value={showPicker === 'start' ? startDate : finishDate} mode={mode} is24Hour={true} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onChangeDate} textColor="white"/>

            )}

            <Text style = {styles.label}>IMAGE</Text>

            <TouchableOpacity style = {styles.imagePicker} onPress = {pickImage}>

              {image ? <Image source = {{ uri: image.uri }} style = {styles.previewImage}/> : <View style = {styles.imagePlaceholder}><Ionicons name = "camera-outline" size = {32} color = "#8b5cf6" /><Text style = {styles.imagePlaceholderText}>Change Photo</Text></View>}

            </TouchableOpacity>

          </ScrollView>

          <View style = {styles.modalFooter}>

            <TouchableOpacity style = {styles.cancelBtn} onPress = {onClose}><Text style = {styles.cancelText}>Cancel</Text></TouchableOpacity>

            <TouchableOpacity style = {styles.submitBtn} onPress = {handleUpdate} disabled = {loading}>

              <Text style = {styles.submitText}>{loading ? "Updating..." : "Save Changes"}</Text>

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
    height: '90%', 
    padding: 24, 
    borderTopWidth: 1, 
    borderColor: 'rgba(139, 92, 246, 0.3)' 

  },

  modalHeader: {

    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 

  },

  modalTitle: { 

    color: 'white', 
    fontSize: 24, 
    fontWeight: '900' 

  },

  modalBody: { 

    flex: 1 

  },

  label: { 

    color: '#c4b5fd', 
    fontSize: 11, 
    fontWeight: '700', 
    letterSpacing: 1.5, 
    marginBottom: 8, 
    marginTop: 15 

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

  textArea: { 

    height: 80, 
    textAlignVertical: 'top' 

  },

  dateTimeContainer: {

    gap: 10 

  },

  buttonRow: { 

    flexDirection: 'row', 
    gap: 10 

  },

  pickerBtn: { 

    flex: 1, 
    backgroundColor: 'rgba(139, 92, 246, 0.1)', 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center' 

  },

  pickerBtnText: { 

    color: 'white', 
    fontWeight: '600', 
    fontSize: 13 

  },

  imagePicker: { 

    height: 120, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 16, 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: '#8b5cf6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10, 
    overflow: 'hidden' 

  },

  previewImage: { 

    width: '100%', 
    height: '100%' 

  },

  imagePlaceholder: { 

    alignItems: 'center' 

  },

  imagePlaceholderText: { 

    color: '#8b5cf6', 
    marginTop: 8 

  },

  modalFooter: { 

    flexDirection: 'row', 
    gap: 12, 
    marginTop: 20, 
    paddingBottom: 20 

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