import { Platform } from 'react-native';

// One place that defines every font choice and size in the app.
// The elder side has a strict rule: body text must never go below 15px.
export default {
  // Large serif font, used ONLY for the "Good morning, Name" greeting.
  greetingFont: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  // Clean sans-serif for everything else (buttons, labels, body text).
  bodyFont: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  sizes: {
    greeting: 32,
    screenTitle: 22,
    buttonTitle: 19,
    body: 17,
    subtitle: 15, // the design system's minimum body text size
    statNumber: 30,
    statLabel: 13,
  },
};
