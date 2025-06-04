import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    minHeight: height,
  },
  loginWrapper: {
    flex: 1,
    flexDirection: width >= 768 ? 'row' : 'column',
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
  loginCard: {
    flex: 1,
    maxWidth: width >= 768 ? 480 : undefined,
    padding: width >= 768 ? 32 : 24,
  },
  loginInfo: {
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
  errorMessage: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    minHeight: 18,
  },
  passwordLabelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF3333',
  },
  togglePassword: {
    position: 'absolute',
    right: 16,
  },
  rememberGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF3333',
    borderColor: '#FF3333',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  btnLogin: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  btnLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  signupPrompt: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  createAccountBtn: {
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