import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatingItem, UserData } from '@/types/dating';

const DATING_ITEMS_KEY = '@dating_items';
const USER_DATA_KEY = '@user_data';

export const saveDatingItems = async (items: DatingItem[]) => {
  try {
    await AsyncStorage.setItem(DATING_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving dating items:', error);
  }
};

export const getDatingItems = async (): Promise<DatingItem[]> => {
  try {
    const items = await AsyncStorage.getItem(DATING_ITEMS_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting dating items:', error);
    return [];
  }
};

export const saveUserData = async (data: UserData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}; 