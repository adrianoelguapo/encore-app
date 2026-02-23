import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { authService } from '@/services/authService';

const { width } = Dimensions.get('window');

export default function AdminBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  const navItems = [

    { name: 'Home', route: '/admindashboard', icon: 'home' },
    { name: 'Concerts', route: '/adminconcerts', icon: 'musical-notes' },
    { name: 'Bookings', route: '/adminbookings', icon: 'ticket' },
    { name: 'Users', route: '/adminusers', icon: 'people' },

  ];

  return (

    <View style = {styles.floatingWrapper}>

      <BlurView intensity = {40} tint = "dark" style = {styles.container}>

        {navItems.map((item) => {

          const isActive = pathname === item.route;

          return (

            <TouchableOpacity key = {item.name} style = {[styles.navItem, isActive && styles.activeNavItem]} onPress = {() => router.push(item.route as any)}>

              <Ionicons name = {isActive ? item.icon as any : `${item.icon}-outline` as any} size = {22} color = {isActive ? '#c4b5fd' : '#9ca3af'}/>
              <Text style = {[styles.navText, isActive && styles.activeText]}>{item.name}</Text>

            </TouchableOpacity>

          );

        })}

        {/* Botón de Logout */}
        <TouchableOpacity style = {styles.navItem} onPress = {handleLogout}>

          <Ionicons name = "log-out-outline" size = {24} color = "#ef4444"/>
          <Text style = {[styles.navText, { color: '#ef4444' }]}>Log Out</Text>

        </TouchableOpacity>

      </BlurView>

    </View>

  );

}

const styles = StyleSheet.create({

  floatingWrapper: {

    position: 'absolute',
    bottom: 30,
    width: width,
    alignItems: 'center',
    zIndex: 100,

  },

  container: {

    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 0, 21, 0.65)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: '90%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#c4b5fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',

  },

  navItem: {

    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    minWidth: 60,

  },

  activeNavItem: {

    backgroundColor: 'rgba(139, 92, 246, 0.2)', 

  },

  navText: {

    fontSize: 10,
    marginTop: 4,
    color: '#9ca3af',
    fontWeight: '500',

  },

  activeText: {

    color: '#c4b5fd',
    fontWeight: 'bold',

  }

});