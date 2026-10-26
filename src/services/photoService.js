import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, db } from './firebase';

export async function uploadPhoto(uri, senderName, senderRole) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `photos/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        senderName,
        senderRole,
        likes: 0,
        createdAt: new Date().toISOString(),
    });
}

export function subscribeToPhotos(callback) {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const photos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(photos);
    });
}