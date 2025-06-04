import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Animated, 
  Easing,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import loginStyles from './loginStyles';
import { useLoginAnimations } from './loginAnimations';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation hooks
  const {
    fadeAnim,
    translateYAnim,
    pulseAnim,
    circle1Pos,
    circle2Pos,
    circle3Pos,
    handleMouseMove
  } = useLoginAnimations();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful login
      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={loginStyles.container}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleMouseMove}
    >
      {/* Parallax circles (desktop only) */}
      {width >= 768 && (
        <>
          <Animated.View style={[
            loginStyles.circle,
            loginStyles.circle1,
            {
              transform: circle1Pos.getTranslateTransform()
            }
          ]} />
          <Animated.View style={[
            loginStyles.circle,
            loginStyles.circle2,
            {
              transform: circle2Pos.getTranslateTransform()
            }
          ]} />
          <Animated.View style={[
            loginStyles.circle,
            loginStyles.circle3,
            {
              transform: circle3Pos.getTranslateTransform()
            }
          ]} />
        </>
      )}

      <View style={loginStyles.loginWrapper}>
        {/* Login Card */}
        <Animated.View style={[
          loginStyles.loginCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}>
          <View style={loginStyles.brand}>
            <View style={loginStyles.logoCircle}>
              <FontAwesome5 name="wallet" size={20} color="white" />
            </View>
            <Text style={loginStyles.logoTitle}>BudgeTaBai</Text>
          </View>

          <Animated.Text style={[
            loginStyles.heading,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            Hello!
          </Animated.Text>
          
          <Animated.Text style={[
            loginStyles.subtitle,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            Enter your credentials to access your account
          </Animated.Text>

          {/* Username Input */}
          <Animated.View style={[
            loginStyles.formGroup,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            <Text style={loginStyles.label}>Username</Text>
            <View style={loginStyles.inputWrapper}>
              <FontAwesome 
                name="envelope" 
                size={16} 
                color="#9CA3AF" 
                style={loginStyles.inputIcon} 
              />
              <TextInput
                style={loginStyles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <Text style={loginStyles.errorMessage}></Text>
          </Animated.View>

          {/* Password Input */}
          <Animated.View style={[
            loginStyles.formGroup,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            <View style={loginStyles.passwordLabelGroup}>
              <Text style={loginStyles.label}>Password</Text>
              <TouchableOpacity>
                <Text style={loginStyles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={loginStyles.inputWrapper}>
              <FontAwesome 
                name="lock" 
                size={16} 
                color="#9CA3AF" 
                style={loginStyles.inputIcon} 
              />
              <TextInput
                style={loginStyles.input}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={loginStyles.togglePassword}
                onPress={togglePassword}
              >
                <FontAwesome 
                  name={showPassword ? "eye" : "eye-slash"} 
                  size={16} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
            <Text style={loginStyles.errorMessage}></Text>
          </Animated.View>

          {/* Remember Me */}
          <Animated.View style={[
            loginStyles.rememberGroup,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            <TouchableOpacity 
              style={loginStyles.checkboxWrapper}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[
                loginStyles.checkbox,
                rememberMe && loginStyles.checkboxChecked
              ]}>
                {rememberMe && (
                  <FontAwesome name="check" size={12} color="white" />
                )}
              </View>
              <Text style={loginStyles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={loginStyles.btnLogin}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <FontAwesome name="spinner" size={20} color="white" />
              ) : (
                <Text style={loginStyles.btnLoginText}>Log In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Signup Prompt */}
          <Animated.View style={[
            loginStyles.signupPrompt,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            <Text style={loginStyles.signupText}>
              Don't have an account?{' '}
              <Text 
                style={loginStyles.createAccountBtn}
                onPress={() => navigation.navigate('Signup')}
              >
                Create account
              </Text>
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Login Info (desktop only) */}
        {width >= 768 && (
          <View style={loginStyles.loginInfo}>
            <View style={loginStyles.infoWrapper}>
              <Text style={loginStyles.infoHeading}>Track your finances with ease</Text>
              <Text style={loginStyles.infoText}>
                BudgeTaBai helps you monitor expenses, and give you your overall summary of your expenses either the past week or the past month.
              </Text>
              <View style={loginStyles.featureList}>
                <View style={loginStyles.featureItem}>
                  <FontAwesome5 name="chart-line" size={16} color="#FFB800" />
                  <Text style={loginStyles.featureText}>Real-time expense monitoring</Text>
                </View>
                <View style={loginStyles.featureItem}>
                  <FontAwesome5 name="piggy-bank" size={16} color="#FFB800" />
                  <Text style={loginStyles.featureText}>Set budget limitations</Text>
                </View>
                <View style={loginStyles.featureItem}>
                  <FontAwesome5 name="bell" size={16} color="#FFB800" />
                  <Text style={loginStyles.featureText}>Smart alerts and notifications</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default LoginScreen;