import { Text, Pressable, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// One column of the three-column stat row on the elder home screen
// (e.g. a big "3" with a small "New Photos" label underneath).
// Tapping it takes the elder straight to what it's counting.
export default function StatCard({ number, label, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={onPress}
    >
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.lightGreen,
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  number: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.statNumber,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.statLabel,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
