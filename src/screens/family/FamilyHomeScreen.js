import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

export default function FamilyHomeScreen({ navigation }) {
  const { logOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Family Dashboard</Text>
      <Text style={styles.subtitle}>Stay connected with your family</Text>

      <Pressable style={styles.row} onPress={() => navigation.navigate('Reminders')}>
        <Text style={styles.rowText}>Reminders</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.rowText}>Calendar</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={() => navigation.navigate('UploadPhoto')}>
        <Text style={styles.rowText}>Upload a photo</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={() => navigation.navigate('PhotoFeed')}>
        <Text style={styles.rowText}>View photos</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={() => navigation.navigate('FamilyMessaging')}>
        <Text style={styles.rowText}>Messages</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={() => navigation.navigate('VoicePlayback')}>
        <Text style={styles.rowText}>Voice messages</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={logOut}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.screenTitle,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  row: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0D5',
  },
  rowText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  logoutButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.roseRed,
  },
});
