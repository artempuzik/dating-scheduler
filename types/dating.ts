import { ZodiacSign } from './zodiac';

export interface DatingItem {
  id: string;
  partnerName: string;
  date: string;
  time: string;
  birthday: string;
  photo?: string;
  zodiacSign?: ZodiacSign;
  phoneNumber?: string;
}

export interface UserData {
  name: string;
  birthday?: string;
  zodiacSign?: ZodiacSign;
  phoneNumber?: string;
} 