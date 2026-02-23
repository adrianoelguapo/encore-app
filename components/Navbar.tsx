import { Colors } from "@/constants/theme";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

export default function Navbar() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { width } = useWindowDimensions();

  useEffect(() => {

    checkAuth();

  }, []);

  const checkAuth = () => {

    setIsAuthenticated(false);

  };

  const handleLogout = () => {

    setIsAuthenticated(false);

  };

  return (

    <View style = {styles.container}>

      <View style = {styles.navbar}>

        <View style = {styles.wrapper}>

          <Link href = "/" asChild>

            <TouchableOpacity>

              <Text style = {styles.logoText}>Encore</Text>

            </TouchableOpacity>

          </Link>

          <View style = {styles.authButtonsGroup}>

            {isAuthenticated ? (

              <TouchableOpacity style = {styles.logoutButton} onPress = {handleLogout}>

                <Text style = {styles.logoutButtonText}>Log Out</Text>

              </TouchableOpacity>

            ) : (

              <>

                <Link href = "/login" asChild>

                  <TouchableOpacity>

                    <Text style = {styles.loginButton}>Log In</Text>

                  </TouchableOpacity>

                </Link>

                <Link href = "/register" asChild>

                  <TouchableOpacity style = {styles.registerButton}>

                    <Text style = {styles.registerButtonText}>Register</Text>

                  </TouchableOpacity>

                </Link>

              </>

            )}

          </View>

        </View>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 56,
    zIndex: 100,
    paddingHorizontal: 16,

  },

  navbar: {

    width: "100%",
    maxWidth: 800,
    paddingHorizontal: 16,

  },

  wrapper: {

    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.dark.navBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: Colors.dark.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 24,

  },

  logoText: {

    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark.text,
    letterSpacing: -0.8,

  },

  authButtonsGroup: {

    flexDirection: "row",
    gap: 24,
    alignItems: "center",

  },

  loginButton: {

    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.text,

  },

  registerButton: {

    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: Colors.primary.purple,
    borderRadius: 12,

  },

  registerButtonText: {

    fontSize: 15,
    fontWeight: "600",
    color: "#1a0a2e",

  },

  logoutButton: {

    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: Colors.primary.purple,
    borderRadius: 12,

  },

  logoutButtonText: {

    fontSize: 15,
    fontWeight: "600",
    color: "#1a0a2e",
  },

});