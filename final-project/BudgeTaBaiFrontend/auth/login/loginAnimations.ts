import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';

const { width } = Dimensions.get('window');

export const useLoginAnimations = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const circle1Pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle2Pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle3Pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const animateElements = () => {
    // Staggered animations for form elements
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
        easing: Easing.ease
      })
    ]).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]),
      { iterations: -1 }
    ).start();
  };

  const handleMouseMove = (e: any) => {
    if (width >= 768) {
      const { locationX, locationY } = e.nativeEvent;
      const x = locationX / width;
      const y = locationY / (width * 0.8);

      Animated.parallel([
        Animated.spring(circle1Pos, {
          toValue: { x: x * 30, y: y * -30 },
          useNativeDriver: true
        }),
        Animated.spring(circle2Pos, {
          toValue: { x: x * -20, y: y * 20 },
          useNativeDriver: true
        }),
        Animated.spring(circle3Pos, {
          toValue: { x: x * 15, y: y * -15 },
          useNativeDriver: true
        })
      ]).start();
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
  };

  useEffect(() => {
    animateElements();
    startPulseAnimation();
  }, []);

  return {
    fadeAnim,
    translateYAnim,
    pulseAnim,
    circle1Pos,
    circle2Pos,
    circle3Pos,
    shakeAnimation,
    handleMouseMove,
    triggerShake
  };
};