import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackToHomeButton from '../../components/elder/BackToHomeButton';
import colors from '../../constants/colors';
import Constants from 'expo-constants';

const SYSTEM_PROMPT = `You are a friendly and patient tech helper for elderly users of the ElderLynk app. 
Your job is to answer questions about using smartphones, tablets, and the ElderLynk app in the simplest way possible.
Rules:
- Always use simple, plain English. Never use technical jargon.
- Keep answers short — 2 to 3 sentences maximum.
- Be warm, encouraging, and patient.
- If someone seems confused, reassure them first before explaining.
- If asked about ElderLynk features, explain: video calling, sending photos, voice messages, reminders, and messaging family.`;

export default function AIHelperScreen() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'assistant', text: 'Hi! I\'m your tech helper. Ask me anything about your phone or the ElderLynk app — I\'ll explain it simply!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = { id: Date.now().toString(), role: 'user', text: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Constants.expoConfig.extra.anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: updatedMessages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text ?? 'Sorry, I didn\'t understand that. Could you try asking again?';
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        <Text style={styles.header}>Tech Helper</Text>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
              <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>{item.text}</Text>
            </View>
          )}
        />
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primaryGreen} />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send</Text>
          </Pressable>
        </View>
        <BackToHomeButton />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  header: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, padding: 16, paddingBottom: 8 },
  list: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '85%', borderRadius: 16, padding: 14, marginBottom: 10 },
  bubbleAI: { backgroundColor: colors.lightGreen, alignSelf: 'flex-start' },
  bubbleUser: { backgroundColor: colors.primaryGreen, alignSelf: 'flex-end' },
  bubbleText: { fontSize: 17, color: colors.textPrimary, lineHeight: 24 },
  bubbleTextUser: { color: colors.white },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  loadingText: { fontSize: 14, color: colors.textSecondary },
  inputRow: { flexDirection: 'row', padding: 12, gap: 10, alignItems: 'flex-end', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.lightGreen },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: 12, padding: 12, fontSize: 17, maxHeight: 100 },
  sendBtn: { backgroundColor: colors.primaryGreen, borderRadius: 12, padding: 14, justifyContent: 'center' },
  sendBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});