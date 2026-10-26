import { ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackToHomeButton from '../../components/elder/BackToHomeButton';
import ScheduleList from '../../components/elder/ScheduleList';
import { useReminders } from '../../context/RemindersContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

export default function ElderCalendarScreen() {
  const { events } = useReminders();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Calendar</Text>
        <ScheduleList
          items={events}
          emptyText="No upcoming visits or events yet."
        />
      </ScrollView>
      <BackToHomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
  content: { flexGrow: 1, paddingTop: 12, paddingBottom: 20 },
  title: {
    fontFamily: typography.greetingFont,
    fontSize: typography.sizes.screenTitle,
    color: colors.textPrimary,
    marginBottom: 16,
  },
});
