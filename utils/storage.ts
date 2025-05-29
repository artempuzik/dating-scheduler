import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatingItem, UserData } from '@/types/dating';

const DATING_ITEMS_KEY = '@dating_items';
const USER_DATA_KEY = '@user_data';
const FUNNEL_URL_KEY = '@funnel_url';
const FUNNEL_START_URL = 'http://love-planner.ru';

export const filterAndResaveDatingItems = async (): Promise<DatingItem[]> => {
  try {
    // Get current date and time
    const currentDate = new Date();

    // Get existing items from AsyncStorage
    const itemsJson = await AsyncStorage.getItem(DATING_ITEMS_KEY);
    let items: DatingItem[] = itemsJson ? JSON.parse(itemsJson) : [];
    // Filter items where the date and time are in the past
    const filteredItems = items.filter(item => {
      const itemDateTime = new Date(`${item.date} ${item.time}`);
      return itemDateTime > currentDate; // Keep items where date/time is in the future
    });

    // Resave filtered items back to AsyncStorage
    await AsyncStorage.setItem(DATING_ITEMS_KEY, JSON.stringify(filteredItems));

    console.log('Filtered and resaved dating items successfully.', filteredItems.length);

    return filteredItems ?? [];

  } catch (error) {
    console.error('Error filtering and resaving dating items:', error);
    return [];
  }
};

export const saveDatingItems = async (items: DatingItem[]) => {
  try {
    return await AsyncStorage.setItem(DATING_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving dating items:', error);
  }
};

export const getDatingItems = async (): Promise<DatingItem[]> => {
  try {
    return await filterAndResaveDatingItems();
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

export const saveLastUrl = async (url?: string) => {
  try {
    console.log('New url: ', url)
    if(url) {
      await AsyncStorage.setItem(FUNNEL_URL_KEY, url);
    } else {
      await AsyncStorage.removeItem(FUNNEL_URL_KEY);
    }
  } catch (e) {
    console.log(e)
  }
};

export const getLastUrl = async () => {
  try {
    const url = await AsyncStorage.getItem(FUNNEL_URL_KEY);
    return url ?? FUNNEL_START_URL;
  } catch (e) {
    return FUNNEL_START_URL;
  }
};