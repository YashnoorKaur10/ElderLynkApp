import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RemindersProvider } from './src/context/RemindersContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RemindersProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </RemindersProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
