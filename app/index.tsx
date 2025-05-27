import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { saveUserData, getUserData } from '../utils/storage';

export default function NameScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const userData = await getUserData();
    if (userData?.name) {
      router.replace('/dating-list');
    }
  };

  const handleSubmit = async () => {
    if (name.trim()) {
      await saveUserData({ name: name.trim() });
      router.replace('/dating-list');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Dating Scheduler</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TouchableOpacity 
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 