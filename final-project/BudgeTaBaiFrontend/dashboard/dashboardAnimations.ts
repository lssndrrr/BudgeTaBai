// dashboardAnimations.ts
import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useDashboardAnimations = () => {
  // Fade animation for the main content
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Bounce animation for cards
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  // Sidebar slide animation
  const sidebarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main content fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Card bounce animation
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 30,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, bounceAnim]);

  // Card bounce transform
  const cardBounce = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -15, 0]
  });

  // Sidebar slide animation
  const toggleSidebarAnimation = (collapsed: boolean) => {
    Animated.timing(sidebarAnim, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  // Sidebar transform
  const sidebarTranslateX = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200] // Adjust based on your sidebar width
  });

  // Notification animation
  const showNotification = () => {
    const notificationAnim = useRef(new Animated.Value(0)).current;
    
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    return notificationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0]
    });
  };

  return {
    fadeAnim,
    cardBounce,
    sidebarTranslateX,
    toggleSidebarAnimation,
    showNotification
  };
};