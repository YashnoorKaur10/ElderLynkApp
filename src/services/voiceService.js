import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { storage, db } from './firebase';

export async function uploadVoiceMessage(uri, senderName, senderRole) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = `voice/${Date.now()}.m4a`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  await addDoc(collection(db, 'voiceMessages'), {
    url: downloadURL,
    senderName,
    senderRole,
    createdAt: new Date().toISOString(),
  });
}

export function subscribeToVoiceMessages(callback) {
  const q = query(collection(db, 'voiceMessages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}