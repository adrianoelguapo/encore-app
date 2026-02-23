import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export default function BackgroundEffects() {

  const glow1Scale = useSharedValue(1);
  const glow1Opacity = useSharedValue(0.3);

  const glow2Scale = useSharedValue(1);
  const glow2Opacity = useSharedValue(0.3);

  React.useEffect(() => {

    glow1Scale.value = withRepeat(withTiming(1.1, { duration: 8000 }), -1, true);
    glow1Opacity.value = withRepeat(withTiming(0.5, { duration: 8000 }), -1, true);

    const timeout = setTimeout(() => {

      glow2Scale.value = withRepeat(withTiming(1.1, { duration: 8000 }), -1, true);

      glow2Opacity.value = withRepeat(withTiming(0.5, { duration: 8000 }), -1, true);

    }, 4000);

    return () => clearTimeout(timeout);

  }, []);

  const animatedGlow1Style = useAnimatedStyle(() => ({

    transform: [{ scale: glow1Scale.value }],
    opacity: glow1Opacity.value,

  }));

  const animatedGlow2Style = useAnimatedStyle(() => ({

    transform: [{ scale: glow2Scale.value }],
    opacity: glow2Opacity.value,

  }));

  return (

    <View style = {styles.container}>

      <Animated.View style = {[styles.glow1Wrapper, animatedGlow1Style]}>

        <BlurView intensity = {80} style = {styles.blur}>

          <LinearGradient

            colors = {[

              "rgba(99, 102, 241, 0)",
              "rgba(99, 102, 241, 0.15)",
              "rgba(99, 102, 241, 0.35)",
              "rgba(99, 102, 241, 0.4)",
              "rgba(99, 102, 241, 0.35)",
              "rgba(99, 102, 241, 0.15)",
              "rgba(99, 102, 241, 0)",

            ]}

            start = {{ x: 0.5, y: 0 }}
            end = {{ x: 0.5, y: 1 }}
            style = {styles.glowContent}

          />

        </BlurView>

      </Animated.View>

      <Animated.View style = {[styles.glow2Wrapper, animatedGlow2Style]}>

        <BlurView intensity = {80} style = {styles.blur}>

          <LinearGradient
          
            colors = {["rgba(99, 102, 241, 0)",
              "rgba(99, 102, 241, 0.15)",
              "rgba(99, 102, 241, 0.4)",
              "#6366f1",
              "rgba(99, 102, 241, 0.4)",
              "rgba(99, 102, 241, 0.15)",
              "rgba(99, 102, 241, 0)",
            ]}

            start = {{ x: 0.5, y: 0 }}
            end = {{ x: 0.5, y: 1 }}
            style = {styles.glowContent}

          />

        </BlurView>

      </Animated.View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",

  },

  blur: {

    width: "100%",
    height: "100%",

  },

  glowContent: {

    width: "100%",
    height: "100%",

  },

  glow1Wrapper: {

    position: "absolute",
    width: 600,
    height: 350,
    top: "-15%",
    right: "-10%",
    borderRadius: 300,
    overflow: "hidden",

  },

  glow2Wrapper: {

    position: "absolute",
    width: 500,
    height: 500,
    bottom: "-35%",
    left: "-10%",
    borderRadius: 250,
    overflow: "hidden",

  },

});