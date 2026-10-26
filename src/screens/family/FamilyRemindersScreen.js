import { View, Text, TextInput, Pressable, StyleSheet, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addReminder, subscribeToReminders } from '../../services/reminderService';
import colors from '../../constants/colors';

export default function FamilyRemindersScreen() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [reminders, setReminders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToReminders(user.uid, (data) => {
      setReminders(data);
    });
    return unsubscribe;
  }, []);

  async function handleAdd() {
    if (!title || !time) {
      Alert.alert('Missing info', 'Please enter a title and time.');
      return;
    }
    await addReminder(title, time, user.uid);
    setTitle('');
    setTime('');
    Alert.alert('Added!', 'Reminder added for the elder.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Add a reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="Reminder title (e.g. Take medicine)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (e.g. 8:00 AM)"
        value={time}
        onChangeText={setTime}
      />
      <Pressable style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>Add reminder</Text>
      </Pressable>
      <Text style={styles.sectionTitle}>Current reminders</Text>
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.reminderCard, item.confirmed && styles.confirmed]}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Text style={styles.reminderTime}>{item.time}</Text>
            <Text style={styles.reminderStatus}>
              {item.confirmed ? '✓ Confirmed by elder' : 'Pending'}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reminders added yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginTop: 8 },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 10, borderWidth: 1, borderColor: colors.lightGreen },
  addBtn: { backgroundColor: colors.primaryGreen, borderRadius: 12, padding: 15, alignItems: 'center', marginBottom: 24 },
  addBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  reminderCard: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.lightGreen },
  confirmed: { opacity: 0.5 },
  reminderTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  reminderTime: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  reminderStatus: { fontSize: 13, color: colors.primaryGreen, marginTop: 4, fontWeight: '600' },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 12 },
});