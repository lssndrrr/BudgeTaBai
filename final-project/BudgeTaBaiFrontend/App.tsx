import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Easing,
  Dimensions,
  Platform
} from 'react-native';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

// Import screens
import LoginScreen from './auth/login/login';
import SignupScreen from './auth/signup/signup';
import DashboardScreen from './dashboard/dashboard';
import OverviewScreen from './overview/overview';
import SettingsScreen from './settings/settings';

// Define the navigation stack types
export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Overview: undefined;
  Settings: undefined;
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;

const linking = {
  prefixes: ['http://localhost:8081'], // Adjust based on your local development server
  config: {
    screens: {
      Landing: '/',
      Login: '/login',
      Signup: '/signup',
      Dashboard: '/dashboard',
      Overview: '/overview',
      Settings: '/settings',
    },
  },
};

const Stack = createStackNavigator<RootStackParamList>();
const { width, height } = Dimensions.get('window');

const LandingPage = () => {
  const navigation = useNavigation<NavigationProps>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const circle1Pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle2Pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const circle3Pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    const handleBack = () => {
      navigation.goBack();
    };

    window.addEventListener('popstate', handleBack);
    return () => window.removeEventListener('popstate', handleBack);
  }, []);

  // Elements to animate
  const animateElements = () => {
    const elements = [
      { ref: fadeAnim, duration: 600, delay: 0 },
      { ref: translateYAnim, duration: 600, delay: 100 },
      // Add more elements as needed
    ];

    elements.forEach((element, index) => {
      Animated.timing(element.ref, {
        toValue: index === 0 ? 1 : 0,
        duration: element.duration,
        delay: element.delay + (index * 100),
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
          toValue: 1.02,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  // Parallax effect for circles
  const setupParallax = () => {
    if (width >= 768) {
      // Set initial positions
      circle1Pos.setValue({ x: 0, y: 0 });
      circle2Pos.setValue({ x: 0, y: 0 });
      circle3Pos.setValue({ x: 0, y: 0 });
    }
  };

  const handleMouseMove = (e: any) => {
    if (width >= 768) {
      const { locationX, locationY } = e.nativeEvent;
      const x = locationX / width;
      const y = locationY / height;

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
    setupParallax();
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleMouseMove}
    >
      {/* Design elements (circles) */}
      {width >= 768 && (
        <>
          <Animated.View style={[
            styles.circle,
            styles.circle1,
            {
              transform: circle1Pos.getTranslateTransform()
            }
          ]} />
          <Animated.View style={[
            styles.circle,
            styles.circle2,
            {
              transform: circle2Pos.getTranslateTransform()
            }
          ]} />
          <Animated.View style={[
            styles.circle,
            styles.circle3,
            {
              transform: circle3Pos.getTranslateTransform()
            }
          ]} />
        </>
      )}

      {/* Header */}
      <Animated.View style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }]
        }
      ]}>
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <FontAwesome5 name="wallet" size={20} color="white" />
          </View>
          <Text style={styles.logoTitle}>BudgeTaBai</Text>
        </View>

        <View style={styles.ctaButtons}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={styles.btnPrimary}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.btnPrimaryText}>Log In</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity 
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.btnSecondaryText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Image 
          source={require('./assets/images/landingBG.png')}
          style={styles.backgroundImage}
        />
        <View style={styles.contentLeft}>
          <Animated.Text style={[
            styles.welcomeMessage,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            Welcome to BudgeTaBai!
          </Animated.Text>
          
          <Animated.Text style={[
            styles.subtitle,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            Track your finances with ease. Stay on top of your spending, set goals, and budget smarter!
          </Animated.Text>
          
          <Animated.View style={[
            styles.startButton,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={styles.btnPrimary}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.btnPrimaryText}>Let's start!</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[
            styles.featureList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            <Text style={styles.featureTitle}>Features:</Text>
            {[
              { icon: 'chart-line', text: 'Real-time expense tracking' },
              { icon: 'piggy-bank', text: 'Budget planning and tracking' },
              { icon: 'bell', text: 'Smart notifications and reminders' }
            ].map((feature, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ 
                      translateY: Animated.add(
                        translateYAnim,
                        new Animated.Value(index * 20)
                      )
                    }]
                  }
                ]}
              >
                <FontAwesome5 name={feature.icon} size={16} color="#FFB800" />
                <Text style={styles.featureText}>{feature.text}</Text>
              </Animated.View>
            ))}
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Overview" component={OverviewScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    minHeight: height,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FF3333',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  btnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  btnSecondaryText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    minHeight: height - 72, // header height
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  contentLeft: {
    flex: 1,
    padding: 32,
    paddingLeft: Platform.OS === 'web' ? 80 : 32,
  },
  welcomeMessage: {
    fontSize: 48,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  subtitle: {
    color: 'white',
    marginBottom: 32,
    fontSize: 16,
  },
  startButton: {
    marginBottom: 32,
  },
  featureList: {
    marginTop: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: 'white',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  featureText: {
    color: 'white',
    fontSize: 14,
  },
  // Circle styles
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    zIndex: 0,
  },
  circle1: {
    width: 300,
    height: 300,
    bottom: -100,
    right: -100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    width: 200,
    height: 200,
    top: '10%',
    left: -50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle3: {
    width: 150,
    height: 150,
    top: '50%',
    right: '30%',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
  },
});

export default App;