import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// Reusable placeholder for family screens not built yet. The family
// side uses React Navigation's normal header back arrow, so unlike the
// elder side this needs no extra "back" component.
export default function ComingSoonScreen({ route }) {
  const label = route?.params?.label ?? 'This feature';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label} is coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  text: { fontFamily: typography.bodyFont, fontSize: typography.sizes.body, color: colors.textSecondary, textAlign: 'center' },
});
