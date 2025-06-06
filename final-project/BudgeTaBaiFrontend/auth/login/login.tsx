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
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../App'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import loginStyles from './loginStyles';
import { useLoginAnimations } from './loginAnimations';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProps>();  // Correctly typed navigation
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    fadeAnim,
    translateYAnim,
    pulseAnim,
    circle1Pos,
    circle2Pos,
    circle3Pos,
    handleMouseMove,
    shakeAnimation,
    triggerShake
  } = useLoginAnimations();

  // useEffect(() => {
  //   // Load remembered credentials if any
  //   const loadCredentials = async () => {
  //     try {
  //       const savedUsername = await SecureStore.getItemAsync('username');
  //       const savedPassword = await SecureStore.getItemAsync('password');
  //       if (savedUsername && savedPassword) {
  //         setFormData({
  //           username: savedUsername,
  //           password: savedPassword
  //         });
  //         setRememberMe(true);
  //       }
  //     } catch (error) {
  //       console.error('Error loading credentials:', error);
  //     }
  //   };
  //   loadCredentials();
  // }, []);

  const validate = () => {
    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      triggerShake();
      return;
    }

    // setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      console.log("Is Response ok: ", response.ok);

      if (response.ok) {
        // Store tokens securely

        console.log("Login successful, storing tokens...");

        await Promise.all([
          localStorage.setItem('access_token', data.access),
          localStorage.setItem('refresh_token', data.refresh)
        ]);

        console.log("Tokens stored successfully");

        // Remember credentials if checkbox is checked
        if (rememberMe) {
          await Promise.all([
            localStorage.setItem('username', formData.username),
            localStorage.setItem('refresh_token', data.refresh)
          ]);
        } else {
          await Promise.all([
            localStorage.removeItem('username'),
            localStorage.removeItem('password')
          ]);
        }

        console.log("Navigating to Dashboard...");
        navigation.navigate('Dashboard');
      } else {
        throw new Error(data.detail || 'Invalid credentials');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message);
      } else {
        Alert.alert('Login Failed', 'An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView 
      contentContainerStyle={loginStyles.container}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleMouseMove}
    >
      {/* Parallax circles */}
      {width >= 768 && (
        <>
          <Animated.View style={[
            loginStyles.circle,
            loginStyles.circle1,
            { transform: circle1Pos.getTranslateTransform() }
          ]} />
          <Animated.View style={[
            loginStyles.circle,
            loginStyles.circle2,
            { transform: circle2Pos.getTranslateTransform() }
          ]} />
          <Animated.View style={[
            loginStyles.circle,
            loginStyles.circle3,
            { transform: circle3Pos.getTranslateTransform() }
          ]} />
        </>
      )}

      <View style={loginStyles.loginWrapper}>
        {/* Login Card */}
        <Animated.View style={[
          loginStyles.loginCard,
          { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
        ]}>
          <View style={loginStyles.brand}>
            <View style={loginStyles.logoCircle}>
              <FontAwesome5 name="wallet" size={20} color="white" />
            </View>
            <Text style={loginStyles.logoTitle}>BudgeTaBai</Text>
          </View>

          <Animated.Text style={[
            loginStyles.heading,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            Hello!
          </Animated.Text>
          
          <Animated.Text style={[
            loginStyles.subtitle,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            Enter your credentials to access your account
          </Animated.Text>

          {/* Username Input */}
          <Animated.View style={[
            loginStyles.formGroup,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            <Text style={loginStyles.label}>Username</Text>
            <View style={loginStyles.inputWrapper}>
              <FontAwesome 
                name="at" 
                size={16} 
                color="#9CA3AF" 
                style={loginStyles.inputIcon} 
              />
              <TextInput
                style={[
                  loginStyles.input,
                  errors.username && loginStyles.inputError,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
                placeholder="Enter your username"
                placeholderTextColor={'#9CA3AF'}
                value={formData.username}
                onChangeText={(text) => {
                  setFormData({...formData, username: text});
                  if (errors.username) setErrors({...errors, username: ''});
                }}
                autoCapitalize="none"
              />
            </View>
            {errors.username ? (
              <Text style={loginStyles.errorMessage}>{errors.username}</Text>
            ) : null}
          </Animated.View>

          {/* Password Input */}
          <Animated.View style={[
            loginStyles.formGroup,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
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
                style={[
                  loginStyles.input,
                  errors.password && loginStyles.inputError,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={'#9CA3AF'}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({...formData, password: text});
                  if (errors.password) setErrors({...errors, password: ''});
                }}
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
            {errors.password ? (
              <Text style={loginStyles.errorMessage}>{errors.password}</Text>
            ) : null}
          </Animated.View>

          {/* Remember Me */}
          <Animated.View style={[
            loginStyles.rememberGroup,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
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
                <ActivityIndicator color="white" />
              ) : (
                <Text style={loginStyles.btnLoginText}>Log In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Signup Prompt */}
          <Animated.View style={[
            loginStyles.signupPrompt,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
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