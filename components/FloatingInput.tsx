import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { Animated, Easing, StyleSheet, TextInput, View } from "react-native";

interface FloatingInputProps {

  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;

}

export default function FloatingInput({ label, value, onChangeText, secureTextEntry = false, placeholder = "", }: FloatingInputProps) {

  const [isFocused, setIsFocused] = useState(false);
  const labelAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {

    const animateTo = isFocused || value ? 1 : 0;

    Animated.timing(labelAnimation, {

      toValue: animateTo,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,

    }).start();

  }, [isFocused, value, labelAnimation]);

  const labelSize = labelAnimation.interpolate({

    inputRange: [0, 1],
    outputRange: [18, 14],

  });

  const labelTop = labelAnimation.interpolate({

    inputRange: [0, 1],
    outputRange: [20, -10],

  });

  const labelColor = labelAnimation.interpolate({

    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.4)", "#c4b5fd"],

  });

  const borderBottomColor = isFocused ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)";

  return (

    <View style = {styles.container}>

      <TextInput style = {[styles.input, { borderBottomColor }]} value = {value} onChangeText = {onChangeText} onFocus = {() => setIsFocused(true)} onBlur = {() => setIsFocused(false)} secureTextEntry = {secureTextEntry} placeholder = {placeholder} placeholderTextColor = "transparent"/>

      <Animated.Text style = {[styles.label, {

            fontSize: labelSize,
            top: labelTop,
            color: labelColor,

          },

        ]}

      >
        {label}

      </Animated.Text>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    position: "relative",
    height: 60,
    marginBottom: 10,

  },

  input: {

    flex: 1,
    paddingBottom: 12,
    paddingTop: 20,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 2,
    fontSize: 18,
    color: Colors.dark.text,

  },

  label: {

    position: "absolute",
    left: 0,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.4)",

  },

});