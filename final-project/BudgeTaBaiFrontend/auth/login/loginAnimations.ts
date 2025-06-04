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

  // Staggered fade-in animation for elements
  const animateElements = () => {
    const elements = [
      { ref: fadeAnim, duration: 500, delay: 0 },
      { ref: translateYAnim, duration: 500, delay: 100 },
    ];

    elements.forEach((element, index) => {
      Animated.timing(element.ref, {
        toValue: index === 0 ? 1 : 0,
        duration: element.duration,
        delay: element.delay,
        useNativeDriver: true,
        easing: Easing.ease
      }).start();
    });
  };

  // Pulse animation for buttons
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

  // Parallax effect for circles
  const handleMouseMove = (e: any) => {
    if (width >= 768) {
      const { locationX, locationY } = e.nativeEvent;
      const x = locationX / width;
      const y = locationY / (width * 0.8); // Adjust for mobile aspect ratio

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
    handleMouseMove
  };
};