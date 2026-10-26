import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// Every single elder screen (except the home screen itself) must show
// this button at the bottom. Elders should never have to rely on a tiny
// back arrow in the corner -- this is a big, obvious, unmissable button.
export default function BackToHomeButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('ElderHome')}
      style={({ pressed }) => [styles.button, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={styles.text}>Back to Home</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
button: {
    width: '80%',
    alignSelf: 'center',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  text: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.buttonTitle,
    fontWeight: '600',
    color: colors.primaryGreen,
  },
});
