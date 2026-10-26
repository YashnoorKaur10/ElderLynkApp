import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// TEMPORARY TEST SCREEN. Once Feature 1 (real email login) is built,
// this screen goes away and LoginScreen becomes the actual entry point.
// For now, these two buttons let us jump straight into each side of
// the app to build and test the elder and family experiences.
export default function WelcomeScreen({ navigation }) {
  const { logIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ElderLynk</Text>
      <Text style={styles.subtitle}>Development preview -- real login coming in Feature 1</Text>

      <Pressable style={[styles.button, { backgroundColor: colors.primaryGreen }]} onPress={() => logIn('elder')}>
        <Text style={styles.buttonText}>Continue as Elder (test)</Text>
      </Pressable>

      <Pressable style={[styles.button, { backgroundColor: colors.steelBlue }]} onPress={() => logIn('family')}>
        <Text style={styles.buttonText}>Continue as Family (test)</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Preview real Login screen &rarr;</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: typography.greetingFont,
    fontSize: typography.sizes.greeting,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    minHeight: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.buttonTitle,
    fontWeight: '600',
    color: colors.white,
  },
  link: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
});
