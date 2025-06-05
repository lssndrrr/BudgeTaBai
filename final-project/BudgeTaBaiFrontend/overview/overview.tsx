import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import overviewStyles from './overviewStyles';
import { useOverviewAnimations } from './overviewAnimations';

type OverviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Overview'>;

const OverviewScreen = () => {
  const navigation = useNavigation<OverviewScreenNavigationProp>();
  const { fadeAnim } = useOverviewAnimations();

  return (
    <View style={overviewStyles.container}>
      <Text style={overviewStyles.header}>Overview Screen</Text>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default OverviewScreen;
