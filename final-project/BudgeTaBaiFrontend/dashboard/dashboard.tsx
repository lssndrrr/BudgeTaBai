import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import dashboardStyles from './dashboardStyles';
import { useDashboardAnimations } from './dashboardAnimations';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { fadeAnim } = useDashboardAnimations(); // simple fade-in

  return (
    <View style={dashboardStyles.container}>
      <Text style={dashboardStyles.header}>Dashboard Screen</Text>
      <Button title="Go to Overview" onPress={() => navigation.navigate('Overview')} />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default DashboardScreen;
