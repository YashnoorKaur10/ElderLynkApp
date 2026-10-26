import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ElderHomeScreen from '../screens/elder/ElderHomeScreen';
// import ElderRemindersScreen from '../screens/elder/ElderRemindersScreen';
// import ElderCalendarScreen from '../screens/elder/ElderCalendarScreen';
import ComingSoonScreen from '../screens/elder/ComingSoonScreen';
import PhotoFeedScreen from '../screens/elder/PhotoFeedScreen';
import MessagingScreen from '../screens/elder/MessagingScreen';
import ReminderScreen from '../screens/elder/RemindersScreen';
import AIHelperScreen from '../screens/elder/AIHelperScreen';
import SendPhotoScreen from '../screens/family/SendPhotoScreen';
const Stack = createNativeStackNavigator();

export default function ElderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ElderHome" component={ElderHomeScreen} />
      <Stack.Screen name="SendPhoto" component={SendPhotoScreen} />
      <Stack.Screen name="Reminders" component={ReminderScreen} />
      <Stack.Screen name="Calendar" component={ComingSoonScreen} initialParams={{ label: 'Calendar' }} />      
      <Stack.Screen name="PhotoFeed" component={PhotoFeedScreen} />
      <Stack.Screen name="Messaging" component={MessagingScreen} />
      <Stack.Screen name="VoiceMessage" component={ComingSoonScreen} initialParams={{ label: 'Voice messages' }} />      
      <Stack.Screen name="AIHelper" component={AIHelperScreen} />
      <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
    </Stack.Navigator>
  );
}
