import { createContext, useContext, useState } from 'react';

const RemindersContext = createContext(null);

let nextId = 1;

// TEMPORARY IMPLEMENTATION -- like AuthContext, this holds reminders
// and calendar events in memory only, so family members can add them
// and elders can see them right away while the app is being tested on
// one device. This gets replaced with real Firestore documents once
// accounts are tied to real families (see the Firebase TODO in
// services/firebase.js) so it also syncs across separate phones.
export function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState([]);
  const [events, setEvents] = useState([]);

  const addReminder = ({ title, date, time, notes }) => {
    setReminders((prev) => [...prev, { id: String(nextId++), title, date, time, notes }]);
  };
  const removeReminder = (id) => {
    setReminders((prev) => prev.filter((item) => item.id !== id));
  };

  const addEvent = ({ title, date, time, notes }) => {
    setEvents((prev) => [...prev, { id: String(nextId++), title, date, time, notes }]);
  };
  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  const value = { reminders, addReminder, removeReminder, events, addEvent, removeEvent };

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders() {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be called from inside a RemindersProvider');
  }
  return context;
}
