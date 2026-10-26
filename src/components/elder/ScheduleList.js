import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// Read-only list of reminders or calendar events for the elder side.
// Family adds the items; elders just see them, in big, simple cards.
export default function ScheduleList({ items, emptyText }) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View>
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          {(item.date || item.time) ? (
            <Text style={styles.when}>
              {[item.date, item.time].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.lightGreen,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  title: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.buttonTitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  when: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.subtitle,
    color: colors.textPrimary,
    marginTop: 4,
  },
  notes: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.subtitle,
    color: colors.textSecondary,
    marginTop: 6,
  },
});
