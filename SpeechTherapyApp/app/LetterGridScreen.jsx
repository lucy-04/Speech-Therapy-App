import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const letters = [
  'क','ख','ग','घ','ङ','च','छ','ज','झ','ञ','ट','ठ','ड','ढ','ण',
  'त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श',
  'ष','स','ह','क्ष','त्र'
];

export default function LetterGridScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>अक्षरों में से चुनें</Text>
      <FlatList
        data={letters}
        numColumns={6}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.letterButton}
            onPress={() => router.push(`./LetterScreen?letter=${encodeURIComponent(item)}`)}
          >
            <Text style={styles.letterText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E0F7FA' },
  header: { fontSize: 22, textAlign: 'center', marginBottom: 20, color: '#00796B' },
  letterButton: {
    backgroundColor: '#FFD54F',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  letterText: { fontSize: 22 },
});
