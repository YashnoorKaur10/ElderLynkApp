import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import colors from '../../constants/colors';
import typography from '../../constants/typography';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('elder');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid
      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Adress"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordRow}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.showBtn}>{showPassword ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>

      <Text style={styles.roleLabel}>I am a:</Text>
      <View style={styles.roleRow}>
        <Pressable
          style={[styles.roleBtn, role === 'elder' && styles.roleBtnSelected]}
          onPress={() => setRole('elder')}>
          <Text style={[styles.roleBtnText, role === 'elder' && styles.roleBtnTextSelected]}>Elder</Text>
        </Pressable>
        <Pressable
          style={[styles.roleBtn, role === 'family' && styles.roleBtnSelected]}
          onPress={() => setRole('family')}>
          <Text style={[styles.roleBtnText, role === 'family' && styles.roleBtnTextSelected]}>Family Member</Text>
        </Pressable>
      </View>
      <Pressable style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
        <Text style={styles.signupBtnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Log in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1,backgroundColor: colors.background, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.primary, marginBottom: 32},
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.lightGreen },
  roleLabel: { fontSize: 15, color: colors.textSecondary, marginBottom: 10 },
  roleRow: { flexDirection: 'row', gap:10,  marginBottom: 20 },
  roleBtn: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.lightGreen, alignItems: 'center' },
  roleBtnSelected: { backgroundColor: colors.primaryGreen, borderColor: colors.primaryGreen },
  roleBtnText: { fontSize: 15, fontWeight: '600',color: colors.textSecondary },
  roleBtnTextSelected: { color: colors.white },
  signupBtn: { backgroundColor: colors.primaryGreen, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  signupBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  loginLink: { color: colors.primaryGreen, fontSize: 14, marginTop: 16, textAlign: 'center' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.lightGreen, marginBottom: 12 },
  passwordInput: { flex: 1, padding: 16, fontSize: 16 },
  showBtn: { color: colors.primaryGreen, fontWeight: '600', paddingHorizontal: 14 }

});