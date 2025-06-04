import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Alert, ScrollView} from 'react-native';
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
  const editingItem = useMemo(() => params.item ? JSON.parse(params.item as string) as DatingItem : null, [params]);

  const [partnerName, setPartnerName] = useState(editingItem?.partnerName || '');
  const [phoneNumber, setPhoneNumber] = useState(editingItem?.phoneNumber || '');
  const [email, setEmail] = useState(editingItem?.email || '');
  const [date, setDate] = useState(editingItem?.date ? new Date(editingItem.date) : new Date());
  const [time, setTime] = useState(() => {
    if (editingItem?.time) {
      const [hours, minutes] = editingItem.time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return date;
    }
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  });
  const [birthday, setBirthday] = useState(editingItem?.birthday ? new Date(editingItem.birthday) : new Date());
  const [photo, setPhoto] = useState(editingItem?.photo || '');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

  const resetForm = () => {
    setPartnerName('');
    setPhoneNumber('');
    setEmail('');
    setDate(new Date());
    setTime(new Date());
    setBirthday(new Date());
    setPhoto('');
  };

  const minTime = useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1)
    return new Date(now);
  }, [time])

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
      phoneNumber,
      date: format(date, 'yyyy-MM-dd'),
      time: format(time, 'HH:mm'),
      birthday: format(birthday, 'yyyy-MM-dd'),
      photo,
      email,
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
      await saveDatingItems(updatedItems)
      await scheduleNotification(newItem);
    } catch (error) {
      console.error('Error saving dating items:', error);
    } finally {
      resetForm()
      router.replace('/dating-list');
    }
  };

  return (
    <ScrollView style={styles.container}>
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
        placeholderTextColor="#000"
        value={partnerName}
        onChangeText={setPartnerName}
      />

      <TextInput
          style={styles.input}
          keyboardType={"phone-pad"}
          placeholder="Partner Phone"
          placeholderTextColor="#000"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
      />

      <TextInput
          style={styles.input}
          keyboardType={"email-address"}
          autoComplete={'email'}
          placeholder="Partner Email"
          autoCapitalize={'none'}
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
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
              value={minTime}
              mode="date"
              minimumDate={new Date()}
              textColor="#000"
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
              minimumDate={minTime}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor="#000"
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
          textColor="#000"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    backgroundColor: '#f3d89d',
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
    color: '#ffffff',
    fontWeight: "500"
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
    backgroundColor: '#f39b9b',
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