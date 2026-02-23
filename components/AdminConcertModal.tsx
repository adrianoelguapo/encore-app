import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authService } from '@/services/authService';

const API_BASE_URL = 'http://172.20.10.3:5000/api';

export default function AdminConcertModal({ visible, onClose, onSuccess }: any) {

  const [form, setForm] = useState({

    name: '',
    description: '',
    capacity: ''

  });

  const [startDate, setStartDate] = useState(new Date());

  const [finishDate, setFinishDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState<'start' | 'finish' | null>(null);

  const [mode, setMode] = useState<'date' | 'time'>('date');

  const [image, setImage] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    
    const currentDate = selectedDate || (showPicker === 'start' ? startDate : finishDate);

    if (showPicker === 'start') {

      setStartDate(currentDate);

    } else {

      setFinishDate(currentDate);

    }

  };

  const openPicker = (type: 'start' | 'finish', pickerMode: 'date' | 'time') => {

    setShowPicker(type);
    setMode(pickerMode);

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

  const handleSubmit = async () => {

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

      const response = await fetch(`${API_BASE_URL}/activities`, {

        method: 'POST',

        headers: {

          'Auth': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',

        },

        body: formData,

      });

      if (response.ok) {

        Alert.alert("Success", "Concert created successfully");
        onSuccess();
        onClose();

      } else {

        const errorData = await response.json();
        Alert.alert("Error", errorData.error || "Failed to create concert");

      }
    } catch (error) {

      Alert.alert("Error", "Network error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <Modal visible = {visible} animationType = "slide" transparent>

      <BlurView intensity = {100} tint = "dark" style = {styles.modalOverlay}>

        <View style = {styles.modalContainer}>

          <View style = {styles.modalHeader}>

            <Text style = {styles.modalTitle}>New Concert</Text>
            <TouchableOpacity onPress = {onClose}><Ionicons name="close" size = {28} color="white"/></TouchableOpacity>

          </View>

          <ScrollView style = {styles.modalBody} showsVerticalScrollIndicator = {false}>

            <Text style = {styles.label}>EVENT NAME</Text>

            <TextInput style = {styles.input} placeholder = "Event name" placeholderTextColor = "#666" value = {form.name} onChangeText = {(text) => setForm({...form, name: text})} />

            <Text style = {styles.label}>DESCRIPTION</Text>

            <TextInput style = {[styles.input, styles.textArea]} multiline numberOfLines = {4} placeholderTextColor = "#666" value = {form.description} onChangeText = {(text) => setForm({...form, description: text})} />

            <Text style = {styles.label}>CAPACITY</Text>
            <TextInput style = {styles.input} keyboardType = "numeric" placeholder = "500" placeholderTextColor = "#666"value = {form.capacity} onChangeText = {(text) => setForm({...form, capacity: text})} />

            <Text style = {styles.label}>SCHEDULE</Text>
            
            <View style = {styles.dateTimeContainer}>

               <View style = {styles.dateBlock}>

                  <Text style = {styles.subLabel}>Starts:</Text>

                  <View style = {styles.buttonRow}>

                    <TouchableOpacity style = {styles.pickerBtn} onPress = {() => openPicker('start', 'date')}>

                      <Text style = {styles.pickerBtnText}>{startDate.toLocaleDateString()}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style = {styles.pickerBtn} onPress = {() => openPicker('start', 'time')}>

                      <Text style = {styles.pickerBtnText}>{startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>

                    </TouchableOpacity>

                  </View>

               </View>

               <View style = {styles.dateBlock}>

                  <Text style = {styles.subLabel}>Ends:</Text>

                  <View style = {styles.buttonRow}>

                    <TouchableOpacity style = {styles.pickerBtn} onPress = {() => openPicker('finish', 'date')}>

                      <Text style = {styles.pickerBtnText}>{finishDate.toLocaleDateString()}</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style = {styles.pickerBtn} onPress = {() => openPicker('finish', 'time')}>

                      <Text style = {styles.pickerBtnText}>{finishDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>

                    </TouchableOpacity>

                  </View>

               </View>

            </View>

            {showPicker && (

              <DateTimePicker value={showPicker === 'start' ? startDate : finishDate} mode={mode} is24Hour={true} display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange = {onChangeDate} textColor = "white"/>
            
            )}

            <Text style = {styles.label}>CONCERT IMAGE</Text>

            <TouchableOpacity style = {styles.imagePicker} onPress = {pickImage}>

              {image ? <Image source = {{ uri: image.uri }} style = {styles.previewImage}/> : <View style = {styles.imagePlaceholder}><Ionicons name = "image-outline" size = {32} color="#8b5cf6"/><Text style = {styles.imagePlaceholderText}>Upload Preview</Text></View>}
            
            </TouchableOpacity>

          </ScrollView>

          <View style = {styles.modalFooter}>

            <TouchableOpacity style = {styles.cancelBtn} onPress = {onClose}><Text style = {styles.cancelText}>Cancel</Text></TouchableOpacity>

            <TouchableOpacity style = {styles.submitBtn} onPress = {handleSubmit} disabled = {loading}>

              <Text style = {styles.submitText}>{loading ? "Saving..." : "Create Event"}</Text>

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

  subLabel: {

    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 5

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

    gap: 15,
    marginBottom: 10

  },

  dateBlock: {

    gap: 5

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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)'

  },

  pickerBtnText: {

    color: 'white',
    fontWeight: '600'

  },

  imagePicker: {

    height: 160,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
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
    marginTop: 8,
    fontWeight: '600'

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