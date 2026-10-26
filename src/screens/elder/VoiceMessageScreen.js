import { View, Text, Pressable, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { uploadVoiceMessage, subscribeToVoiceMessages } from '../../services/voiceService';
import { useAuth } from '../../context/AuthContext';
import BackToHomeButton from '../../components/elder/BackToHomeButton';
import colors from '../../constants/colors';

export default function VoiceMessageScreen() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [senderName, setSenderName] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchName() {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setSenderName(docSnap.data().name);
    }
    fetchName();
    const unsubscribe = subscribeToVoiceMessages((data) => setMessages(data));
    return () => {
      unsubscribe();
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      setUploading(true);
      await uploadVoiceMessage(uri, senderName, 'elder');
      Alert.alert('Sent!', 'Your voice message was sent to your family.');
    } catch (error) {
      Alert.alert('Error', 'Could not send voice message. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function playMessage(url, id) {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (playingId === id) {
        setPlayingId(null);
        return;
      }
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      soundRef.current = sound;
      setPlayingId(id);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setPlayingId(null);
      });
    } catch (error) {
      Alert.alert('Error', 'Could not play this message.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={styles.header}>Voice Messages</Text>
      <View style={styles.recordSection}>
        <Pressable
          style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={uploading}
        >
          <Text style={styles.recordBtnIcon}>{isRecording ? '⏹' : '🎤'}</Text>
          <Text style={styles.recordBtnText}>
            {uploading ? 'Sending...' : isRecording ? 'Tap to stop & send' : 'Tap to record'}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.sectionLabel}>Received messages</Text>
      {messages.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No voice messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.messageCard} onPress={() => playMessage(item.url, item.id)}>
              <View style={styles.messageInfo}>
                <Text style={styles.messageSender}>{item.senderName}</Text>
                <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.playIcon}>{playingId === item.id ? '⏸' : '▶️'}</Text>
            </Pressable>
          )}
        />
      )}
      <BackToHomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, padding: 16, paddingBottom: 8 },
  recordSection: { alignItems: 'center', padding: 24 },
  recordBtn: { width: 160, height: 160, borderRadius: 80, backgroundColor: colors.primaryGreen, alignItems: 'center', justifyContent: 'center', gap: 8 },
  recordBtnActive: { backgroundColor: colors.roseRed },
  recordBtnIcon: { fontSize: 40 },
  recordBtnText: { fontSize: 14, fontWeight: '700', color: colors.white, textAlign: 'center' },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, paddingHorizontal: 16, marginBottom: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  list: { padding: 16, paddingBottom: 100 },
  messageCard: { backgroundColor: colors.white, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lightGreen },
  messageInfo: { flex: 1 },
  messageSender: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  messageTime: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  playIcon: { fontSize: 24 },
});