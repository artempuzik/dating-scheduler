import * as Notifications from 'expo-notifications';
import { DatingItem } from '@/types/dating';
import {saveDailyNotificationId} from "@/utils/storage";

export const scheduleNotification = async (datingItem: DatingItem) => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const [hours, minutes] = datingItem.time.split(':').map(Number);
    const [year, month, day] = datingItem.date.split('-').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);
    date.setMinutes(date.getMinutes() - 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Date!',
        body: `You have a date with ${datingItem.partnerName} in 1h!`,
        data: { datingItem, url: 'datingapp://' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Date!',
        body: `Congratulations!!! You have a date with ${datingItem.partnerName} in ${datingItem.date} at ${datingItem.time}!`,
        data: { datingItem, url: 'datingapp://' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });
  } catch (error) {
    console.error('Error canceling scheduled notification:', error);
    throw error;
  }
};

export const cancelNotification = async (id: string) => {
  await Notifications.cancelScheduledNotificationAsync(id);
  console.log('Notifications canceled successfully', id);
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('Notifications canceled successfully');
};

export const dailyNotification = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    // Cancel any existing daily notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new daily notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Скучаешь?',
        body: `К твоей странице проявляют интерес. Не пропусти новые знакомства!`,
        data: { url: 'datingapp://' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 30,
      },
    });
    await saveDailyNotificationId(notificationId);
    console.log('Notification scheduled successfully', notificationId);
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    throw error;
  }
};