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
import signupStyles from './signupStyles';
import { useSignupAnimations } from './signupAnimations';

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
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
  
  // Animation hooks
  const {
    fadeAnim,
    translateYAnim,
    pulseAnim,
    circle1Pos,
    circle2Pos,
    circle3Pos,
    handleMouseMove,
    shakeAnimation
  } = useSignupAnimations();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    // Password validation
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

  const handleSignup = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful signup
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={signupStyles.container}
      onMoveShouldSetResponder={() => true}
      onResponderMove={handleMouseMove}
    >
      {/* Parallax circles (desktop only) */}
      {width >= 768 && (
        <>
          <Animated.View style={[
            signupStyles.circle,
            signupStyles.circle1,
            {
              transform: circle1Pos.getTranslateTransform()
            }
          ]} />
          <Animated.View style={[
            signupStyles.circle,
            signupStyles.circle2,
            {
              transform: circle2Pos.getTranslateTransform()
            }
          ]} />
          <Animated.View style={[
            signupStyles.circle,
            signupStyles.circle3,
            {
              transform: circle3Pos.getTranslateTransform()
            }
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
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}>
          <View style={signupStyles.brand}>
            <View style={signupStyles.logoCircle}>
              <FontAwesome5 name="wallet" size={20} color="white" />
            </View>
            <Text style={signupStyles.logoTitle}>BudgeTaBai</Text>
          </View>

          <Animated.Text style={[
            signupStyles.heading,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            Create Account
          </Animated.Text>
          
          <Animated.Text style={[
            signupStyles.subtitle,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}>
            Join us and start managing your finances today
          </Animated.Text>

          {/* Name Inputs */}
          <View style={signupStyles.nameGroup}>
            <Animated.View style={[
              signupStyles.formGroup,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }]
              }
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
                  onChangeText={(text) => handleChange('firstName', text)}
                />
              </View>
              {errors.firstName ? (
                <Text style={signupStyles.errorMessage}>{errors.firstName}</Text>
              ) : null}
            </Animated.View>

            <Animated.View style={[
              signupStyles.formGroup,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }]
              }
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
                  onChangeText={(text) => handleChange('lastName', text)}
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
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
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
                onChangeText={(text) => handleChange('username', text)}
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
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
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
                onChangeText={(text) => handleChange('email', text)}
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
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
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
                onChangeText={(text) => handleChange('password', text)}
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
                <FontAwesome name="spinner" size={20} color="white" />
              ) : (
                <Text style={signupStyles.btnSignupText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Login Prompt */}
          <Animated.View style={[
            signupStyles.loginPrompt,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
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