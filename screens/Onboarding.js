import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validName = (n) => /^[A-Za-z]+$/.test(n.trim());
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export default function Onboarding({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const enabled = validName(firstName) && validEmail(email);

  const onNext = async () => {
    try {
      await AsyncStorage.multiSet([
        ['firstName', firstName.trim()],
        ['email', email.trim()],
        ['onboarded', 'true'],
      ]);
      navigation.replace('Home');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Little Lemon</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Let us get to know you</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !enabled && styles.buttonDisabled]}
          disabled={!enabled}
          onPress={onNext}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DEE3E9' },
  header: { backgroundColor: '#EDEFEE', paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: 'bold', color: '#495E57' },
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 40, color: '#333' },
  label: { fontSize: 18, color: '#333', marginBottom: 6 },
  input: {
    height: 48, borderWidth: 2, borderColor: '#495E57', borderRadius: 10,
    paddingHorizontal: 12, fontSize: 16, backgroundColor: '#fff', marginBottom: 24,
  },
  footer: { padding: 30, backgroundColor: '#F1F4F7', alignItems: 'flex-end' },
  button: { backgroundColor: '#495E57', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  buttonDisabled: { backgroundColor: '#B5BFBB' },
  buttonText: { color: '#fff', fontSize: 18 },
});
