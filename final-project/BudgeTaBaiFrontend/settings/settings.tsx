import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import settingsStyles from './settingsStyles';
import { useSettingsAnimations } from './settingsAnimations';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { fadeAnim } = useSettingsAnimations();

  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.header}>Settings Screen</Text>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Go to Overview" onPress={() => navigation.navigate('Overview')} />
    </View>
  );
};

export default SettingsScreen;
