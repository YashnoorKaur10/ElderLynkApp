import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ElderButton from '../../components/elder/ElderButton';
import StatCard from '../../components/elder/StatCard';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function ElderHomeScreen({ navigation }) {
  const { logOut, user } = useAuth();
  const [elderName, setElderName] = useState('');
  const [photoCount, setPhotoCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setElderName(docSnap.data().name);
      const photos = await getDocs(collection(db, 'photos'));
      setPhotoCount(photos.size);
      const messages = await getDocs(collection(db, 'messages'));
      setMessageCount(messages.size);
      const reminders = await getDocs(query(collection(db, 'reminders'), where('confirmed', '==', false)));
      setReminderCount(reminders.size);
    }
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>{getGreeting()}, {elderName}</Text>

        <View style={styles.statsRow}>
          <StatCard number={photoCount} label="Photos" onPress={() => navigation.navigate('PhotoFeed')} />
          <StatCard number={messageCount} label="Messages" onPress={() => navigation.navigate('Messaging')} />
          <StatCard number={reminderCount} label="Reminders" onPress={() => navigation.navigate('Reminders')} />
        </View>

        <View style={styles.aiHelperBar}>
          <Text style={styles.aiHelperText} onPress={() => navigation.navigate('AIHelper')}>
            Need help with your phone? Tap here to ask.
          </Text>
        </View>

        <ElderButton
          title="Send Photo"
          subtitle="Share a photo with your family"
          iconName="camera"
          backgroundColor={colors.roseRed}
          onPress={() => navigation.navigate('SendPhoto')}
        />
        <ElderButton
          title="Messages"
          subtitle="Chat with your family"
          iconName="chatbubbles"
          backgroundColor={colors.steelBlue}
          onPress={() => navigation.navigate('Messaging')}
        />
        <ElderButton
          title="Family Updates"
          subtitle="See photos from your family"
          iconName="images"
          backgroundColor={colors.primaryGreen}
          onPress={() => navigation.navigate('PhotoFeed')}
        />
        <ElderButton
          title="Reminders"
          subtitle="Medicine, appointments, and more"
          iconName="alarm"
          backgroundColor={colors.cream}
          textColor={colors.textPrimary}
          onPress={() => navigation.navigate('Reminders')}
        />
        <Pressable style={styles.logOutBtn} onPress={logOut}>
          <Text style={styles.logOutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  greeting: { fontFamily: typography.greetingFont, fontSize: typography.sizes.greeting, color: colors.textPrimary, marginBottom: 20 },
  statsRow: { flexDirection: 'row', marginBottom: 20 },
  aiHelperBar: { backgroundColor: colors.lightGreen, borderRadius: 14, padding: 16, marginBottom: 24 },
  aiHelperText: { fontFamily: typography.bodyFont, fontSize: typography.sizes.body, color: colors.textPrimary, textAlign: 'center' },
  logOutBtn: { marginTop: 16, padding: 16, alignItems: 'center' },
  logOutText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});


