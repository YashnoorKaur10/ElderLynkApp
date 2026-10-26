import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// Shared "add + list" UI for both family Reminders and family Calendar
// screens -- the two are identical except for the labels and which
// RemindersContext list/actions they're pointed at.
export default function ScheduleManager({ items, onAdd, onRemove, titlePlaceholder }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), date: date.trim(), time: time.trim(), notes: notes.trim() });
    setTitle('');
    setDate('');
    setTime('');
    setNotes('');
  };

  return (
    <View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={titlePlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder="Date (e.g. Oct 3)"
            placeholderTextColor={colors.textSecondary}
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder="Time (e.g. 9:00 AM)"
            placeholderTextColor={colors.textSecondary}
            value={time}
            onChangeText={setTime}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Notes (optional)"
          placeholderTextColor={colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
        />
        <Pressable
          style={({ pressed }) => [styles.addButton, { opacity: pressed || !title.trim() ? 0.6 : 1 }]}
          onPress={handleAdd}
          disabled={!title.trim()}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {(item.date || item.time) ? (
              <Text style={styles.itemWhen}>
                {[item.date, item.time].filter(Boolean).join(' · ')}
              </Text>
            ) : null}
            {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
          </View>
          <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={colors.roseRed} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0D5',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  input: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: '#E0E0D5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryGreen,
    borderRadius: 8,
    paddingVertical: 10,
  },
  addButtonText: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0D5',
  },
  itemText: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemWhen: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.subtitle,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemNotes: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.subtitle,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
