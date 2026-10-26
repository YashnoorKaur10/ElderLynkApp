import { ScrollView, Text, StyleSheet } from 'react-native';
import ScheduleManager from '../../components/family/ScheduleManager';
import { useReminders } from '../../context/RemindersContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

export default function FamilyCalendarScreen() {
  const { events, addEvent, removeEvent } = useReminders();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>These show up right away on Margaret's Calendar screen.</Text>
      <ScheduleManager
        items={events}
        onAdd={addEvent}
        onRemove={removeEvent}
        titlePlaceholder="Event (e.g. Doctor's appointment)"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});
