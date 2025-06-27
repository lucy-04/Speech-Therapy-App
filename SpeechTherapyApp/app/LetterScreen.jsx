import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function LetterScreen() {
  const { letter } = useLocalSearchParams();
  const router = useRouter();

  const [recording, setRecording] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const startRecording = async () => {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
          alert('Permission to access microphone is required!');
          return;
        }
  
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
  
        setRecording(recording);
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    };
  
    const stopRecording = async () => {
      try {
        setRecording(null);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped, file saved at:', uri);
        await uploadAudio(uri);
      } catch (err) {
        console.error('Failed to stop recording:', err);
      }
    };
  
    const uploadAudio = async (uri) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('audio', {
          uri,
          name: 'speech.m4a',
          type: 'audio/x-m4a',
        });
  
        const response = await fetch('http://192.168.1.103:3000/transcribe', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const data = await response.json();
        setTranscript(data.transcription || 'No transcript returned.');
      } catch (err) {
        console.error('Upload failed:', err);
        setTranscript('Error during transcription.');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <View style={styles.letterBox}>
        <Text style={styles.letter}>{letter}</Text>
      </View>

      <TouchableOpacity style={styles.micButton} onPress={recording? stopRecording : startRecording}>
        <Ionicons name="mic" size={36} color="#fff"/>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {transcript !== '' && (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>📝 Transcript:</Text>
                <Text style={styles.transcriptText}>{transcript}</Text>
              </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', top: 40, left: 20 },
  letterBox: {
    width: 150,
    height: 150,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: { fontSize: 64, color: '#fff' },
  micButton: {
    backgroundColor: '#263238',
    padding: 20,
    borderRadius: 50,
    marginTop: 40,
  },
  transcriptBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcc80',
  },
  transcriptLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transcriptText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
});
