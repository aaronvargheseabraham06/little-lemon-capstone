import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const MENU = [
  { id: '1', name: 'Greek Salad', price: 12.99, category: 'Starters', description: 'Crisp lettuce, peppers, olives and feta cheese, finished with a garlic and rosemary dressing.' },
  { id: '2', name: 'Bruschetta', price: 7.99, category: 'Starters', description: 'Grilled bread smeared with garlic and topped with tomato, olive oil and sea salt.' },
  { id: '3', name: 'Grilled Fish', price: 20.0, category: 'Mains', description: 'Fresh catch of the day grilled with lemon butter and herbs.' },
  { id: '4', name: 'Pasta', price: 18.99, category: 'Mains', description: 'Penne with a rich tomato sauce, basil and shaved parmesan.' },
  { id: '5', name: 'Lemon Dessert', price: 6.99, category: 'Desserts', description: 'Traditional homemade lemon tart with a buttery crust.' },
  { id: '6', name: 'Tiramisu', price: 7.5, category: 'Desserts', description: 'Layers of espresso-soaked sponge and mascarpone cream.' },
  { id: '7', name: 'Lemonade', price: 3.5, category: 'Drinks', description: 'Fresh squeezed lemons with a hint of mint.' },
  { id: '8', name: 'Sparkling Water', price: 2.5, category: 'Drinks', description: 'Chilled sparkling mineral water with a slice of lemon.' },
];

export default function Home({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  // Reload profile data every time Home is focused so header avatar stays current.
  useEffect(() => {
    const load = async () => {
      const [[, fn], [, av]] = await AsyncStorage.multiGet(['firstName', 'avatar']);
      setFirstName(fn || '');
      setAvatar(av || null);
    };
    load();
    return navigation.addListener('focus', load);
  }, [navigation]);

  // Header: profile avatar button on the right.
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>{(firstName[0] || '?').toUpperCase()}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, avatar, firstName]);

  const toggle = (c) =>
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const data = useMemo(
    () =>
      MENU.filter(
        (m) =>
          (selected.length === 0 || selected.includes(m.category)) &&
          m.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query, selected]
  );

  const Header = (
    <View>
      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <Text style={styles.heroCity}>Chicago</Text>
        <Text style={styles.heroText}>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>
        <TextInput
          style={styles.search}
          placeholder="Search menu"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* MENU BREAKDOWN */}
      <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c) => {
          const on = selected.includes(c);
          return (
            <TouchableOpacity
              key={c}
              onPress={() => toggle(c)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FOOD MENU LIST */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        ListHeaderComponent={Header}
        ListEmptyComponent={<Text style={styles.empty}>No dishes match your search.</Text>}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemImg}>
              <Text style={{ fontSize: 28 }}>🍋</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarFallback: { backgroundColor: '#495E57', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hero: { backgroundColor: '#495E57', padding: 16 },
  heroTitle: { fontSize: 44, color: '#F4CE14', fontWeight: 'bold' },
  heroCity: { fontSize: 24, color: '#fff', marginBottom: 8 },
  heroText: { color: '#fff', fontSize: 16, marginBottom: 16 },
  search: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 16 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18, padding: 16, paddingBottom: 8 },
  chips: { paddingHorizontal: 16, paddingBottom: 16 },
  chip: { backgroundColor: '#EDEFEE', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16, marginRight: 10 },
  chipOn: { backgroundColor: '#495E57' },
  chipText: { color: '#495E57', fontWeight: 'bold' },
  chipTextOn: { color: '#fff' },
  divider: { height: 1, backgroundColor: '#ddd', marginHorizontal: 16 },
  item: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  itemName: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
  itemDesc: { color: '#495E57', marginBottom: 6 },
  itemPrice: { color: '#495E57', fontWeight: '500' },
  itemImg: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F4CE14', alignItems: 'center', justifyContent: 'center' },
  empty: { textAlign: 'center', padding: 24, color: '#666' },
});
