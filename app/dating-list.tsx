import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { DatingItem } from '../types/dating';
import { getDatingItems, saveDatingItems } from '../utils/storage';
import { differenceInYears, parseISO } from 'date-fns';

export default function DatingListScreen() {
  const [datingItems, setDatingItems] = useState<DatingItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadDatingItems();
  }, []);

  const loadDatingItems = async () => {
    const items = await getDatingItems();
    setDatingItems(items);
  };

  const handleAddDating = () => {
    router.push('/dating-form');
  };

  const handleEditDating = (item: DatingItem) => {
    router.push({
      pathname: '/dating-form',
      params: { item: JSON.stringify(item) }
    });
  };

  const handleDeleteDating = async (id: string) => {
    const updatedItems = datingItems.filter(item => item.id !== id);
    await saveDatingItems(updatedItems);
    setDatingItems(updatedItems);
  };

  const calculateAge = (birthday: string) => {
    return differenceInYears(new Date(), parseISO(birthday));
  };

  const renderDatingItem = ({ item }: { item: DatingItem }) => (
    <View style={styles.itemContainer}>
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.photo} />
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.partnerName}>{item.partnerName}</Text>
        <Text>Date: {item.date}</Text>
        <Text>Time: {item.time}</Text>
        <Text>Age: {calculateAge(item.birthday)} years</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditDating(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteDating(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dating List</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDating}>
          <Text style={styles.addButtonText}>Add New Date</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={datingItems}
        renderItem={renderDatingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actions: {
    justifyContent: 'center',
  },
  editButton: {
    color: '#007AFF',
    marginBottom: 10,
  },
  deleteButton: {
    color: '#FF3B30',
  },
}); 