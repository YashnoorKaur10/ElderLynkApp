import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

const Stack = createNativeStackNavigator();

// Shown whenever nobody is logged in yet.
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true, title: 'Log In' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true, title: 'Sign Up' }} />
    </Stack.Navigator>
  );
}
