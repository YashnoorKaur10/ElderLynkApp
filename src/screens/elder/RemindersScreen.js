import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator} from 'react-native';
import { useState, useEffect} from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../services/firebase';
import { subscribeToReminders } from '../../services/reminderService';
import { useAuth } from '../../context/AuthContext';
import BackToHomeButton from '../../components/elder/BackToHomeButton';
import colors from '../../constants/colors';

export default function RemindersScreen() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const unsubscribe = subscribeToReminders(user.uid, (data) => {
            setReminders(data);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    async function handleConfirm(reminderId) {
        const ref = doc(db, 'reminders', reminderId);
        await updateDoc(ref, { confirmed: true });
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.centered}>
                    <Text style={styles.loadingText}>No reminders yet...Your family will add some soon!</Text>
                    <BackToHomeButton />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <FlatList
                data={reminders}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
          <View style={[styles.card, item.confirmed && styles.cardConfirmed]}>
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.confirmed ? (
              <Pressable style={styles.confirmBtn} onPress={() => handleConfirm(item.id)}>
                <Text style={styles.confirmBtnText}>✓ Done</Text>
              </Pressable>
            ) : (
              <Text style={styles.confirmedLabel}>✓ Confirmed</Text>
            )}
          </View>
        )}
      />
      <BackToHomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  list: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lightGreen },
  cardConfirmed: { opacity: 0.5 },
  cardInfo: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  time: { fontSize: 15, color: colors.textSecondary },
  confirmBtn: { backgroundColor: colors.primaryGreen, borderRadius: 10, padding: 12 },
  confirmBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  confirmedLabel: { color: colors.primaryGreen, fontWeight: '700', fontSize: 14 },
  emptyText: { fontSize: 18, color: colors.textSecondary, textAlign: 'center', lineHeight: 28 },
});
