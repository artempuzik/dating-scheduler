import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Alert} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { DatingItem } from '@/types/dating';
import { getDatingItems, saveDatingItems } from '@/utils/storage';
import { scheduleNotification } from '@/utils/notifications';
import { format } from 'date-fns';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatingFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingItem = params.item ? JSON.parse(params.item as string) as DatingItem : null;

  const [partnerName, setPartnerName] = useState(editingItem?.partnerName || '');
  const [date, setDate] = useState(editingItem?.date ? new Date(editingItem.date) : new Date());
  const [time, setTime] = useState(new Date());
  const [birthday, setBirthday] = useState(editingItem?.birthday ? new Date(editingItem.birthday) : new Date());
  const [photo, setPhoto] = useState(editingItem?.photo || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(prev => !prev);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(prev => !prev);
  };

  const toggleBirthdayPicker = () => {
    setShowBirthdayPicker(prev => !prev);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleBirthdayChange = (event: any, selectedBirthday?: Date) => {
    setShowBirthdayPicker(false);
    if (selectedBirthday) {
      setBirthday(selectedBirthday);
    }
  };

  const handleSubmit = async () => {
    if (!partnerName) {
      return;
    }

    const items = await getDatingItems();
    const newItem: DatingItem = {
      id: editingItem?.id || Date.now().toString(),
      partnerName,
      date: format(date, 'yyyy-MM-dd'),
      time: format(time, 'HH:mm'),
      birthday: format(birthday, 'yyyy-MM-dd'),
      photo,
    };
    let updatedItems;
    if (editingItem) {
      updatedItems = items.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedItems = [...items, newItem];
    }
    try {
      await scheduleNotification(newItem);
      await saveDatingItems(updatedItems);
      router.push('/dating-list');
    } catch (error) {
      console.error('Error saving dating items:', error);
      Alert.alert('Error', 'Failed to schedule notification. Invalid date/time format.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingItem ? 'Edit Date' : 'Add New Date'}</Text>
      
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Text style={styles.photoButtonText}>Add Photo</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Partner Name"
        value={partnerName}
        onChangeText={setPartnerName}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={toggleDatePicker}
      >
        <Text style={styles.dateButtonText}>
          Date: {format(date, 'yyyy-MM-dd')}
        </Text>
      </TouchableOpacity>

      {(showDatePicker) && (
          <DateTimePicker
              value={date}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
          />
      )}

      <TouchableOpacity
        style={styles.dateButton}
        onPress={toggleTimePicker}
      >
        <Text style={styles.dateButtonText}>
          Time: {format(time, 'HH:mm')}
        </Text>
      </TouchableOpacity>

      {(showTimePicker) && (
          <DateTimePicker
              value={time}
              mode="time"
              minimumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
          />
      )}

      <TouchableOpacity
        style={styles.dateButton}
        onPress={toggleBirthdayPicker}
      >
        <Text style={styles.dateButtonText}>
          Birthday: {format(birthday, 'yyyy-MM-dd')}
        </Text>
      </TouchableOpacity>

      {(showBirthdayPicker) && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleBirthdayChange}
          style={Platform.OS === 'ios' ? styles.iosPicker : undefined}
        />
      )}

      <TouchableOpacity 
        style={[styles.submitButton, !partnerName && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!partnerName}
      >
        <Text style={styles.submitButtonText}>
          {editingItem ? 'Save Changes' : 'Add Date'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoButtonText: {
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  iosPicker: {
    height: 200,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 