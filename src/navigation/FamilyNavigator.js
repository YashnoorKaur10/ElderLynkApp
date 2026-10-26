import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FamilyHomeScreen from '../screens/family/FamilyHomeScreen';
import FamilyRemindersScreen from '../screens/family/FamilyRemindersScreen';
import FamilyCalendarScreen from '../screens/family/FamilyCalendarScreen';
import ComingSoonScreen from '../screens/family/ComingSoonScreen';
import colors from '../constants/colors';
import SendPhotoScreen from '../screens/family/SendPhotoScreen';
import FamilyMessagingScreen from '../screens/family/FamilyMessagingScreen';
import ReminderScreen from '../screens/family/FamilyRemindersScreen';
import FamilyPhotoFeedScreen from '../screens/family/FamilyPhotoFeedScreen';
const Stack = createNativeStackNavigator();


export default function FamilyNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primaryGreen },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="FamilyHome" component={FamilyHomeScreen} options={{ title: 'ElderLynk' }} />
      <Stack.Screen name="PhotoFeed" component={FamilyPhotoFeedScreen} options={{ title: 'Photos' }} />
      <Stack.Screen name="Reminders" component={FamilyRemindersScreen} options={{ title: 'Reminders' }} />
      <Stack.Screen name="Calendar" component={FamilyCalendarScreen} options={{ title: 'Calendar' }} />
      <Stack.Screen name="UploadPhoto" component={SendPhotoScreen} initialParams={{ label: 'Photo upload' }} options={{ title: 'Upload Photo' }} />
      <Stack.Screen name="FamilyMessaging" component={FamilyMessagingScreen} options={{ title: 'Messages' }} />
      <Stack.Screen name="VoicePlayback" component={ComingSoonScreen} initialParams={{ label: 'Voice messages' }} options={{ title: 'Voice Messages' }} />    
    </Stack.Navigator>
  );
}
