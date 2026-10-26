import { View, Text, FlatList, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { subscribeToPhotos } from '../../services/photoService';
import colors from '../../constants/colors';

export default function FamilyPhotoFeedScreen({ navigation }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPhotos((data) => {
      setPhotos(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primaryGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No photos yet — send the first one!</Text>
          <Pressable style={styles.sendBtn} onPress={() => navigation.navigate('UploadPhoto')}>
            <Text style={styles.sendBtnText}>Send a photo</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Pressable style={styles.sendBtn} onPress={() => navigation.navigate('UploadPhoto')}>
              <Text style={styles.sendBtnText}>+ Send a photo</Text>
            </Pressable>
          }
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
              {item.likes > 0 && (
                <Text style={styles.likes}>❤️ {item.likes} {item.likes === 1 ? 'love' : 'loves'}</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  list: { padding: 16, paddingBottom: 40 },
  sendBtn: { backgroundColor: colors.primaryGreen, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 16 },
  sendBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: colors.white, borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.lightGreen },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primaryGreen },
  senderName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  timestamp: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  image: { width: '100%', height: 260 },
  likes: { fontSize: 15, color: colors.textSecondary, padding: 12 },
  emptyText: { fontSize: 18, color: colors.textSecondary, textAlign: 'center', lineHeight: 28, marginBottom: 20 },
});