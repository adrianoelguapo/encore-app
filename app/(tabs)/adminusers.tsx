/* --- Importaciones --- */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { authService } from "@/services/authService";
import BackgroundEffects from "@/components/BackgroundEffects";
import AdminBottomNav from "@/components/AdminBottomNav";
import AdminUserEditModal from "@/components/AdminUserEditModal";
import { Colors } from "@/constants/theme";

/* --- URL de la API --- */
const API_BASE_URL = 'http://172.20.10.3:5000/api';

/* --- Vista de todos los usuarios (admin)  --- */
export default function AdminUsers() {

  /* --- Lista de usuarios --- */
  const [users, setUsers] = useState([]);

  /* --- Barra de búsqueda --- */
  const [search, setSearch] = useState("");

  /* --- Actualizar la lista --- */
  const [refreshing, setRefreshing] = useState(false);

  /* --- Usuario seleccionado --- */
  const [selectedUser, setSelectedUser] = useState<any>(null);

  /* --- Si el modal está abierto o no --- */
  const [isModalVisible, setIsModalVisible] = useState(false);

  /* --- Obtener la lista de usuarios --- */
  const fetchUsers = async () => {

    try {

      /* --- Obtener el token --- */
      const token = authService.getToken();

      /* --- Realizar la petición al backend --- */
      const res = await fetch(`${API_BASE_URL}/users`, {

        /* --- Enviar el token en la petición --- */
        headers: { 'Auth': `Bearer ${token}` }

      });

      /* --- Convertir la respuesta a JSON --- */
      const data = await res.json();

      /* --- Si la respuesta es correcta, se guardan los usuarios --- */
      if (res.ok) setUsers(data);

    } catch (error) {

      /* --- Si hay un error, se devuelve --- */
      console.error("Error fetching users:", error);

    }

  };

  /* --- Actualizar la lista de usuarios al cargar la vista --- */
  useEffect(() => { fetchUsers(); }, []);

  /* --- Actualizar la lista de usuarios al refrescar --- */
  const onRefresh = useCallback(() => {

    setRefreshing(true);
    fetchUsers().then(() => setRefreshing(false));

  }, []);

  const handleDelete = (user: any) => {
    Alert.alert("Eliminar Usuario", /* --- Título --- */

      /* --- Mensaje --- */
      `¿Estás seguro de que quieres eliminar a ${user.username}?`,

      /* --- Botones --- */
      [

        { text: "Cancelar", style: "cancel" },

        { 

          text: "Eliminar", 
          style: "destructive", 

          /* --- Método que se ejecuta al presionar el botón de eliminar --- */
          onPress: async () => {

            /* --- Obtener el token --- */
            const token = authService.getToken();

            /* --- Realizar la petición al backend --- */
            await fetch(`${API_BASE_URL}/users/${user.id}`, { 

              /* --- Método DELETE --- */
              method: 'DELETE', 

              /* --- Enviar el token en la petición --- */
              headers: { 'Auth': `Bearer ${token}` } 

            });

            /* --- Actualizar la lista de usuarios para que se reflejen los cambios --- */
            fetchUsers();

          }

        }

      ]

    );

  };

  /* --- Filtrar los usuarios por nombre o nombre de usuario (para el buscador) --- */
  const filteredUsers = users.filter((u: any) => 

    u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase())

  );

  return (

    /* --- Contenedor principal de la vista --- */
    <View style = {styles.container}>

      {/* --- Efectos de fondo --- */}
      <LinearGradient colors = {["#1a0033", "#000000", "#0a0015"]} style = {styles.gradientContainer}/>
      <BackgroundEffects/>

      {/* --- Contenedor con scroll para mostrar los usuarios --- */}
      <ScrollView contentContainerStyle = {styles.scrollContent} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} tintColor = "#c084fc"/>}>
        
        {/* --- Header --- */}
        <View style = {styles.header}>

          {/* --- Título --- */}
          <Text style = {styles.title}>User Management</Text>

          {/* --- Subtítulo --- */}
          <Text style = {styles.subtitle}>Manage festival members</Text>

        </View>

        {/* --- Buscador --- */}
        <View style = {styles.searchBox}>

          {/* --- Icono de búsqueda --- */}
          <Ionicons name = "search" size = {20} color = "rgba(255,255,255,0.3)"/>

          {/* --- Input de texto para buscar --- */}
          <TextInput style = {styles.searchInput} placeholder = "Search by name or username..." placeholderTextColor = "rgba(255,255,255,0.3)" value = {search} onChangeText = {setSearch}/>
        
        </View>

        {/* --- Lista de usuarios --- */}
        <View style = {styles.userList}>

          {/* --- Se mapean todos los usuarios --- */}
          {filteredUsers.map((user: any) => (

            /* --- Contenedor para la tarjeta del usuario --- */ 
            <View key = {user.id} style = {styles.userCard}>

              {/* --- Información del usuario --- */}
              <View style = {styles.userInfo}>

                {/* --- Nombre completo --- */}
                <Text style = {styles.userName}>{user.name}</Text>

                {/* --- Nombre de usuario --- */}
                <Text style = {styles.userHandle}>@{user.username}</Text>

              </View>
              
              {/* --- Botones --- */}
              <View style = {styles.actions}>

                {/* --- Botón de editar usuario (abre el modal de edición de usuario) --- */}
                <TouchableOpacity style = {styles.actionBtn} onPress = {() => { setSelectedUser(user); setIsModalVisible(true); }}>

                  <Ionicons name = "pencil" size = {18} color = "#c084fc" />

                </TouchableOpacity>

                {/* --- Botón de eliminar usuario (abre el alert de eliminación de usuario) --- */}
                <TouchableOpacity style = {[styles.actionBtn, styles.deleteBtn]} onPress = {() => handleDelete(user)}>

                  <Ionicons name = "trash" size = {18} color = "#ef4444" />

                </TouchableOpacity>

              </View>

            </View>

          ))}

        </View>

      </ScrollView>

      {/* --- Modal para editar usuarios --- */}
      <AdminUserEditModal visible = {isModalVisible} user = {selectedUser} onClose = {() => setIsModalVisible(false)} onSuccess = {fetchUsers}/>

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
    marginBottom: 25 

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

  searchBox: { 

    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 14, 
    paddingHorizontal: 15, 
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'

  },

  searchInput: { 

    flex: 1, 
    paddingVertical: 15, 
    color: 'white', 
    marginLeft: 10 

  },

  userList: { 

    gap: 10 

  },

  userCard: { 

    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    borderRadius: 18,
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

    color: 'rgba(255,255,255,0.4)', 
    fontSize: 13, 
    marginTop: 2 

  },

  actions: { 

    flexDirection: 'row', 
    gap: 10 

  },

  actionBtn: { 

    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    justifyContent: 'center', 
    alignItems: 'center' 

  },

  deleteBtn: { 

    backgroundColor: 'rgba(239, 68, 68, 0.1)' 

  }
  
});