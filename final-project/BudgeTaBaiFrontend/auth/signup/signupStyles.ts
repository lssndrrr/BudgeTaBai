import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    minHeight: height,
  },
  signupWrapper: {
    flex: 1,
    flexDirection: width >= 768 ? 'row-reverse' : 'column',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    margin: width >= 768 ? 20 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  signupCard: {
    flex: 1,
    maxWidth: width >= 768 ? 480 : undefined,
    padding: width >= 768 ? 32 : 24,
  },
  signupInfo: {
    flex: 1,
    backgroundColor: '#FF3333',
    padding: 32,
    justifyContent: 'center',
  },
  infoWrapper: {
    zIndex: 2,
  },
  infoHeading: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    lineHeight: 24,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 32,
    fontSize: 16,
  },
  nameGroup: {
    flexDirection: width >= 768 ? 'row' : 'column',
    gap: 16,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorMessage: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    minHeight: 18,
  },
  togglePassword: {
    position: 'absolute',
    right: 16,
  },
  btnSignup: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  btnSignupText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loginPrompt: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    color: '#FF3333',
    fontWeight: '500',
  },
  featureList: {
    marginTop: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
  },
  // Circle styles for parallax effect
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    zIndex: 1,
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