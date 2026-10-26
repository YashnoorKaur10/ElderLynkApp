import { View, Text, Pressable, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadPhoto } from '../../services/photoService';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import {db} from '../../services/firebase';

export default function SendPhotoScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();
    const [senderName, setSenderName] = useState('');

    useEffect(() => {
        async function fetchName() {
            const docSnap = await getDoc(doc(db, 'users', user.uid));
            if (docSnap.exists()) {
                setSenderName(docSnap.data().name);
            }
        }
        fetchName();
    }, []);

async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes : ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
    });
    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
}

async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow access to your camera');
        return;
    }
    const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
    });
    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
}

async function handleSend() {
    if(!image) {
        Alert.alert('No photo', 'Please pick or take a photo first.');
        return;
    }
    setUploading(true);
    try {
        await uploadPhoto(image, senderName, 'family');
        Alert.alert('Sent!', 'Your photo was sent.');
        setImage(null);
        navigation.goBack();
    } catch (error) {
        Alert.alert('Upload failed', error.message);
    } finally {
        setUploading(false);
    }   
}

return (
    <View style={styles.container}>
        <Text style={styles.title}>Send a Photo</Text>
        {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
        ) : (
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>No photo selected</Text>
            </View>
        )}
        <Pressable style={styles.btnGreen} onPress={pickImage}>
            <Text style={styles.btnText}>Choose from cameraroll</Text>
        </Pressable>
        <Pressable style={styles.btnOutlineGreen} onPress={takePhoto}>
            <Text style={styles.btnOutlineText}>Take a photo</Text>
        </Pressable>
        {image && (
            <Pressable style={styles.btnSend} onPress={handleSend}>
                <Text style={styles.btnText}>{uploading ? 'Sending...' : 'Send'}</Text>
            </Pressable>
        )}
    </View>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 20, marginTop: 20 },
  preview: { width: '100%', height: 260, borderRadius: 16, marginBottom: 16 },
  placeholder: { width: '100%', height: 260, borderRadius: 16, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  placeholderText: { color: colors.textSecondary, fontSize: 15 },
  btnGreen: { backgroundColor: colors.primaryGreen, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10 },
  btnOutlineGreen: { borderWidth: 1.5, borderColor: colors.primaryGreen, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10 },
  btnSend: { backgroundColor: colors.steelBlue, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 6 },
  btnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  btnOutlineText: { color: colors.primaryGreen, fontSize: 15, fontWeight: '700' },
});