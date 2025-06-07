import { Animated, Easing } from "react-native";

export const settingsAnimations = {
  // Animate cards with a bounce effect
  animateCards: (animation: Animated.Value) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      easing: Easing.bezier(0.5, 0.01, 0, 1),
      useNativeDriver: true,
    }).start();
  },

  // Bounce animation for interactive elements
  bounce: (value: Animated.Value) => {
    Animated.sequence([
      Animated.timing(value, {
        toValue: 0.4,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0.6,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  },

  // Fade in animation
  fadeIn: (value: Animated.Value) => {
    Animated.timing(value, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  },

  // Slide in animation
  slideIn: (value: Animated.Value) => {
    Animated.parallel([
      Animated.timing(value, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(value, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  },
};
