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
import signupStyles from './signupStyles';
import { useSignupAnimations } from './signupAnimations';

const { width } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
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
  } = useSignupAnimations();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : 'This field is required';
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 4) return 'Must be at least 4 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only letters, numbers and _';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Must be at least 8 characters';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      newErrors[key as keyof typeof newErrors] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Account Created', 
          'Your account has been created successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        // Handle backend validation errors
        const backendErrors: Record<string, string[]> = data;
        const formattedErrors = { ...errors };

        Object.keys(backendErrors).forEach(key => {
          if (key in formattedErrors) {
            formattedErrors[key as keyof typeof formattedErrors] = 
              backendErrors[key].join(', ');
          }
        });

        setErrors(formattedErrors);
        throw new Error('Registration failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Registration Error', error.message);
      } else {
        Alert.alert('Registration Error', 'An unknown error occurred');
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
      contentContainerStyle={signupStyles.container}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleMouseMove}
    >
      {/* Parallax circles */}
      {width >= 768 && (
        <>
          <Animated.View style={[
            signupStyles.circle,
            signupStyles.circle1,
            { transform: circle1Pos.getTranslateTransform() }
          ]} />
          <Animated.View style={[
            signupStyles.circle,
            signupStyles.circle2,
            { transform: circle2Pos.getTranslateTransform() }
          ]} />
          <Animated.View style={[
            signupStyles.circle,
            signupStyles.circle3,
            { transform: circle3Pos.getTranslateTransform() }
          ]} />
        </>
      )}

      <View style={signupStyles.signupWrapper}>
        {/* Signup Info (desktop only) */}
        {width >= 768 && (
          <View style={signupStyles.signupInfo}>
            <View style={signupStyles.infoWrapper}>
              <Text style={signupStyles.infoHeading}>Track your finances with ease</Text>
              <Text style={signupStyles.infoText}>
                BudgeTaBai helps you monitor expenses and gives you a full summary of your past week or month's expenses.
              </Text>
              <View style={signupStyles.featureList}>
                <View style={signupStyles.featureItem}>
                  <FontAwesome5 name="chart-line" size={16} color="#FFB800" />
                  <Text style={signupStyles.featureText}>Real-time expense monitoring</Text>
                </View>
                <View style={signupStyles.featureItem}>
                  <FontAwesome5 name="piggy-bank" size={16} color="#FFB800" />
                  <Text style={signupStyles.featureText}>Set budget limitations</Text>
                </View>
                <View style={signupStyles.featureItem}>
                  <FontAwesome5 name="bell" size={16} color="#FFB800" />
                  <Text style={signupStyles.featureText}>Smart alerts and notifications</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Signup Card */}
        <Animated.View style={[
          signupStyles.signupCard,
          { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
        ]}>
          <View style={signupStyles.brand}>
            <View style={signupStyles.logoCircle}>
              <FontAwesome5 name="wallet" size={20} color="white" />
            </View>
            <Text style={signupStyles.logoTitle}>BudgeTaBai</Text>
          </View>

          <Animated.Text style={[
            signupStyles.heading,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            Create Account
          </Animated.Text>
          
          <Animated.Text style={[
            signupStyles.subtitle,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            Join us and start managing your finances today
          </Animated.Text>

          {/* Name Inputs */}
          <View style={signupStyles.nameGroup}>
            <Animated.View style={[
              signupStyles.formGroup,
              { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
            ]}>
              <Text style={signupStyles.label}>First Name</Text>
              <View style={signupStyles.inputWrapper}>
                <FontAwesome 
                  name="user" 
                  size={16} 
                  color="#9CA3AF" 
                  style={signupStyles.inputIcon} 
                />
                <TextInput
                  style={[
                    signupStyles.input,
                    errors.firstName && signupStyles.inputError,
                    { transform: [{ translateX: shakeAnimation }] }
                  ]}
                  placeholder="Juan"
                  value={formData.firstName}
                  onChangeText={(text) => {
                    setFormData({...formData, firstName: text});
                    if (errors.firstName) setErrors({...errors, firstName: ''});
                  }}
                />
              </View>
              {errors.firstName ? (
                <Text style={signupStyles.errorMessage}>{errors.firstName}</Text>
              ) : null}
            </Animated.View>

            <Animated.View style={[
              signupStyles.formGroup,
              { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
            ]}>
              <Text style={signupStyles.label}>Last Name</Text>
              <View style={signupStyles.inputWrapper}>
                <FontAwesome 
                  name="user" 
                  size={16} 
                  color="#9CA3AF" 
                  style={signupStyles.inputIcon} 
                />
                <TextInput
                  style={[
                    signupStyles.input,
                    errors.lastName && signupStyles.inputError,
                    { transform: [{ translateX: shakeAnimation }] }
                  ]}
                  placeholder="Cruz"
                  value={formData.lastName}
                  onChangeText={(text) => {
                    setFormData({...formData, lastName: text});
                    if (errors.lastName) setErrors({...errors, lastName: ''});
                  }}
                />
              </View>
              {errors.lastName ? (
                <Text style={signupStyles.errorMessage}>{errors.lastName}</Text>
              ) : null}
            </Animated.View>
          </View>

          {/* Username Input */}
          <Animated.View style={[
            signupStyles.formGroup,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            <Text style={signupStyles.label}>Username</Text>
            <View style={signupStyles.inputWrapper}>
              <FontAwesome 
                name="at" 
                size={16} 
                color="#9CA3AF" 
                style={signupStyles.inputIcon} 
              />
              <TextInput
                style={[
                  signupStyles.input,
                  errors.username && signupStyles.inputError,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
                placeholder="juancruz143"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData({...formData, username: text});
                  if (errors.username) setErrors({...errors, username: ''});
                }}
                autoCapitalize="none"
              />
            </View>
            {errors.username ? (
              <Text style={signupStyles.errorMessage}>{errors.username}</Text>
            ) : null}
          </Animated.View>

          {/* Email Input */}
          <Animated.View style={[
            signupStyles.formGroup,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            <Text style={signupStyles.label}>Email</Text>
            <View style={signupStyles.inputWrapper}>
              <FontAwesome 
                name="envelope" 
                size={16} 
                color="#9CA3AF" 
                style={signupStyles.inputIcon} 
              />
              <TextInput
                style={[
                  signupStyles.input,
                  errors.email && signupStyles.inputError,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
                placeholder="juan@example.com"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({...formData, email: text});
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? (
              <Text style={signupStyles.errorMessage}>{errors.email}</Text>
            ) : null}
          </Animated.View>

          {/* Password Input */}
          <Animated.View style={[
            signupStyles.formGroup,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            <Text style={signupStyles.label}>Password</Text>
            <View style={signupStyles.inputWrapper}>
              <FontAwesome 
                name="lock" 
                size={16} 
                color="#9CA3AF" 
                style={signupStyles.inputIcon} 
              />
              <TextInput
                style={[
                  signupStyles.input,
                  errors.password && signupStyles.inputError,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
                placeholder="Create a strong password"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({...formData, password: text});
                  if (errors.password) setErrors({...errors, password: ''});
                }}
              />
              <TouchableOpacity 
                style={signupStyles.togglePassword}
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
              <Text style={signupStyles.errorMessage}>{errors.password}</Text>
            ) : null}
          </Animated.View>

          {/* Signup Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={signupStyles.btnSignup}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={signupStyles.btnSignupText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Login Prompt */}
          <Animated.View style={[
            signupStyles.loginPrompt,
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
          ]}>
            <Text style={signupStyles.loginText}>
              Already have an account?{' '}
              <Text 
                style={signupStyles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Log in
              </Text>
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;