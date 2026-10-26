import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

// The main button style used all over the elder side of the app:
// a full-width rounded rectangle with a big icon on the left,
// a title, and a smaller subtitle underneath the title.
export default function ElderButton({
  title,
  subtitle,
  iconName,
  backgroundColor,
  textColor = colors.white,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Ionicons name={iconName} size={36} color={textColor} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 88, // comfortably larger than the 44px minimum tap target
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.buttonTitle,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: typography.bodyFont,
    fontSize: typography.sizes.subtitle,
    marginTop: 2,
  },
});
