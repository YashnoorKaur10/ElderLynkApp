import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import {useAuth} from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import ElderNavigator from './ElderNavigator';
import FamilyNavigator from './FamilyNavigator';
import colors from '../constants/colors';

export default function RootNavigator() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {role === 'elder' && <ElderNavigator />}
      {role === 'family' && <FamilyNavigator />}
      {role === null && <AuthNavigator />}
    </NavigationContainer>
  );
}