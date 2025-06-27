import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <ImageBackground source={require('../assets/bg.jpeg')} style={styles.container}>
      <Text style={styles.title}>Speech Therapy App</Text>
      <Link href="./LetterGridScreen" asChild>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>login</Text>
        </TouchableOpacity>
      </Link>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 36,
    textAlign: 'center',
    color: '#D22B2B',
    fontFamily: 'Cochin',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#B9FBC0',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  loginText: { color: '#000', fontSize: 18 },
});
