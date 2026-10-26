import { View, Text, FlatList, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { subscribeToPhotos } from '../../services/photoService';
import BackToHomeButton from '../../components/elder/BackToHomeButton';
import colors from '../../constants/colors';

export default function PhotoFeedScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPhotos((data) => {
      setPhotos(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleLike(photoId) {
    const photoRef = doc(db, 'photos', photoId);
    await updateDoc(photoRef, { likes: increment(1) });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family Updates</Text>
        <Pressable style={styles.sendBtn} onPress={() => navigation.navigate('SendPhoto')}>
          <Text style={styles.sendBtnText}>+ Send Photo</Text>
        </Pressable>
      </View>
      {photos.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No photos yet — your family will send some soon!</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.senderName?.[0] ?? '?'}</Text>
                </View>
                <View>
                  <Text style={styles.senderName}>{item.senderName}</Text>
                  <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              <Image source={{ uri: item.url }} style={styles.image} />
              <Pressable style={styles.likeBtn} onPress={() => handleLike(item.id)}>
                <Text style={styles.likeBtnText}>❤️ Love it {item.likes > 0 ? `· ${item.likes}` : ''}</Text>
              </Pressable>
            </View>
          )}
        />
      )}
      <BackToHomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  sendBtn: { backgroundColor: colors.primaryGreen, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  sendBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  list: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: colors.white, borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.lightGreen },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primaryGreen },
  senderName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  timestamp: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  image: { width: '100%', height: 260 },
  likeBtn: { backgroundColor: colors.lightGreen, margin: 12, borderRadius: 12, padding: 14, alignItems: 'center' },
  likeBtnText: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 18, color: colors.textSecondary, textAlign: 'center', lineHeight: 28 },
});