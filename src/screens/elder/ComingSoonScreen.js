import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackToHomeButton from '../../components/elder/BackToHomeButton';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// Reusable placeholder for any elder screen that isn't built yet.
// Every real screen we build later follows this same layout shape:
// content on top, BackToHomeButton pinned at the bottom.
export default function ComingSoonScreen({ route }) {
  const label = route?.params?.label ?? 'This feature';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.text}>{label} is coming soon!</Text>
      </View>
      <BackToHomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
