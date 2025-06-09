export interface DatingItem {
  id: string;
  partnerName: string;
  date: string;
  time: string;
  birthday: string;
  photo?: string;
  description?: string;
  rating?: number;
  phoneNumber?: string;
  email?: string;
}

export interface UserData {
  name: string;
  birthday?: string;
  phoneNumber?: string;
} 