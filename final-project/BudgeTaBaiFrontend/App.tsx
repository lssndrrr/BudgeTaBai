import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

// Import screens
import LoginScreen from './auth/login/login';
import SignupScreen from './auth/signup/signup';
import DashboardScreen from './dashboard/dashboard';
import OverviewScreen from './overview/overview';
import SettingsScreen from './settings/settings';

const Stack = createStackNavigator();

const LandingPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Animation logic similar to your animations4.js
    // React Native has its own animation system (Animated API)
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.logoCircle}>
            <FontAwesome name="wallet" size={20} color="white" />
          </View>
          <Text style={styles.logoTitle}>BudgeTaBai</Text>
        </View>

        <View style={styles.ctaButtons}>
          <TouchableOpacity 
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btnPrimaryText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.btnSecondaryText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.contentLeft}>
          <Text style={styles.welcomeMessage}>Welcome to BudgeTaBai!</Text>
          <Text style={styles.subtitle}>
            Track your finances with ease. Stay on top of your spending, set goals, and budget smarter!
          </Text>
          
          <View style={styles.startButton}>
            <TouchableOpacity 
              style={styles.btnPrimary}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.btnPrimaryText}>Let's start!</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Features:</Text>
            {[
              { icon: 'chart-line', text: 'Real-time expense tracking' },
              { icon: 'piggy-bank', text: 'Budget planning and tracking' },
              { icon: 'bell', text: 'Smart notifications and reminders' }
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <FontAwesome name={feature.icon} size={16} color="#FFB800" />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
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
    minHeight: '100%',
    backgroundColor: 'url("./landingBG.png")', // Note: In React Native, you'd use ImageBackground component
  },
  contentLeft: {
    flex: 1,
    padding: 32,
    paddingLeft: 80,
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
});

export default App;