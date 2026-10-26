import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../services/firebase';
import { sendMessage, subscribeToMessages } from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';

export default function FamilyMessagingScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [senderName, setSenderName] = useState('');
  const { user } = useAuth();
  const flatListRef = useRef(null);

  useEffect(() => {
    async function fetchName() {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setSenderName(docSnap.data().name);
    }
    fetchName();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((data) => {
      setMessages(data);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsubscribe;
  }, []);

  async function handleSend() {
    if (!text.trim()) return;
    await sendMessage(text.trim(), senderName, 'family');
    setText('');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={110}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          extraData={senderName}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.senderName === senderName ? styles.bubbleFamily : styles.bubbleElder]}>
              <Text style={[styles.bubbleSender, { color: item.senderName === senderName ? '#FFFFFF' : '#1A2E1A' }]}>{item.senderName}</Text>
              <Text style={[styles.bubbleText, item.senderName === senderName && styles.bubbleTextFamily]}>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 8 },
  bubble: { padding: 14, borderRadius: 16, marginBottom: 10, maxWidth: '80%' },
  bubbleFamily: { backgroundColor: colors.primaryGreen, alignSelf: 'flex-end' },
  bubbleElder: { backgroundColor: colors.white, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.lightGreen },
  bubbleSender: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  bubbleText: { fontSize: 16, color: colors.textPrimary },
  bubbleTextFamily: { color: colors.white },
  inputRow: { flexDirection: 'row', padding: 12, gap: 10, alignItems: 'flex-end', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.lightGreen },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: 12, padding: 12, fontSize: 16, maxHeight: 100 },
  sendBtn: { backgroundColor: colors.primaryGreen, borderRadius: 12, padding: 14, justifyContent: 'center' },
  sendBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
