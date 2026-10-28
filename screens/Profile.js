import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const validName = (n) => /^[A-Za-z]+$/.test(n.trim());
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  orderStatuses: true, passwordChanges: true, specialOffers: true, newsletter: true,
};

export default function Profile({ navigation }) {
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(EMPTY);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('profile');
      const fn = (await AsyncStorage.getItem('firstName')) || '';
      const em = (await AsyncStorage.getItem('email')) || '';
      const base = raw ? JSON.parse(raw) : { ...EMPTY, firstName: fn, email: em };
      setForm(base);
      setSaved(base);
    })();
  }, []);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!validName(form.firstName)) return Alert.alert('Invalid first name', 'Use letters only.');
    if (form.lastName && !validName(form.lastName)) return Alert.alert('Invalid last name', 'Use letters only.');
    if (!validEmail(form.email)) return Alert.alert('Invalid email', 'Enter a valid email address.');
    if (form.phone && !/^\d{10}$/.test(form.phone)) return Alert.alert('Invalid phone', 'Enter a 10 digit number.');
    await AsyncStorage.setItem('profile', JSON.stringify(form));
    await AsyncStorage.multiSet([['firstName', form.firstName], ['email', form.email]]);
    setSaved(form);
    Alert.alert('Saved', 'Your changes have been saved.');
  };

  const discard = () => setForm(saved);

  const logout = async () => {
    await AsyncStorage.clear();
    setForm(EMPTY);
    setSaved(EMPTY);
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Onboarding' }] })
    );
  };

  const initial = (form.firstName[0] || '?').toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.heading}>Personal information</Text>

      <Text style={styles.label}>Avatar</Text>
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </View>

      <Text style={styles.label}>First name</Text>
      <TextInput style={styles.input} value={form.firstName} onChangeText={set('firstName')} />
      <Text style={styles.label}>Last name</Text>
      <TextInput style={styles.input} value={form.lastName} onChangeText={set('lastName')} />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" />
      <Text style={styles.label}>Phone number</Text>
      <TextInput style={styles.input} value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="10 digits" />

      <Text style={styles.heading}>Email notifications</Text>
      {[
        ['orderStatuses', 'Order statuses'],
        ['passwordChanges', 'Password changes'],
        ['specialOffers', 'Special offers'],
        ['newsletter', 'Newsletter'],
      ].map(([k, label]) => (
        <View key={k} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{label}</Text>
          <Switch value={form[k]} onValueChange={set(k)} trackColor={{ true: '#495E57' }} />
        </View>
      ))}

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.discard} onPress={discard}>
          <Text style={styles.discardText}>Discard changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.save} onPress={save}>
          <Text style={styles.saveText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginVertical: 12 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 14 },
  avatarRow: { flexDirection: 'row', marginBottom: 14 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#495E57', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  switchLabel: { fontSize: 16 },
  logout: { backgroundColor: '#F4CE14', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 24, borderWidth: 1, borderColor: '#e0b800' },
  logoutText: { fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, marginBottom: 32 },
  discard: { flex: 1, borderWidth: 1, borderColor: '#495E57', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  discardText: { color: '#495E57', fontWeight: 'bold' },
  save: { flex: 1, backgroundColor: '#495E57', padding: 12, borderRadius: 8, alignItems: 'center', marginLeft: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
});
