import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export async function sendMessage(text, senderName, senderRole) {
    await addDoc(collection(db, 'messages'), {
        text,
        senderName,
        senderRole,
        createdAt: new Date().toISOString(),
    });
}

export function subscribeToMessages(callback) {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(messages);
    });
}