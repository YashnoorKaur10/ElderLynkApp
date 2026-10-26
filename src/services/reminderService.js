import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export async function addReminder(title, time, elderUid) {
    await addDoc(collection(db, 'reminders'), {
        title,
        time,
        elderUid,
        confirmed: false,
        createdAt: new Date().toISOString(),
    });
}

export function subscribeToReminders(elderUid, callback) {
    const q = query(
        collection(db, 'reminders'),
        orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
        const reminders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(reminders);
    });
}