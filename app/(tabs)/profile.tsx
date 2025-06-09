import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform} from 'react-native';
import { saveUserData, getUserData } from '@/utils/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { UserData } from '@/types/dating';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await getUserData();
    if (data) {
      setUserData(data);
      setName(data.name);
      setPhoneNumber(data.phoneNumber || '');
      if (data.birthday) {
        setBirthday(new Date(data.birthday));
      }
    }
  };

  const handleSave = async () => {
    if (name.trim() && birthday) {
      const updatedData: UserData = {
        name: name.trim(),
        birthday: birthday.toISOString().split('T')[0],
        phoneNumber: phoneNumber.trim()
      };
      await saveUserData(updatedData);
      setUserData(updatedData);
      setIsEditing(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{userData?.name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{userData?.phoneNumber || 'Not set'}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Birthday</Text>
          {isEditing ? (
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {birthday ? birthday.toLocaleDateString() : 'Select your birthday'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.value}>
              {userData?.birthday ? new Date(userData.birthday).toLocaleDateString() : 'Not set'}
            </Text>
          )}
        </View>

        {showDatePicker && (
            <DateTimePicker
                value={birthday ?? new Date()}
                mode="date"
                maximumDate={new Date()}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
            />
        )}

        {isEditing && (
          <TouchableOpacity 
            style={[styles.saveButton, (!name.trim() || !birthday) && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!name.trim() || !birthday}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f39b9b',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  zodiacContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  zodiacSymbol: {
    fontSize: 30,
    marginRight: 10,
  },
  zodiacText: {
    fontSize: 18,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iosPicker: {
    height: 200,
    marginBottom: 15,
  },
}); 