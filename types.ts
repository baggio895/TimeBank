
export enum ExchangeStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface UserProfile {
  id: string;
  name: string;
  credits: number;
  avatar: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  tags: string[]; // 例如：永續、熱情、環境整潔
}

export interface GlassDonation {
  id: string;
  donorId: string;
  description: string;
  condition: string;
  estimatedCredits: number;
  status: ExchangeStatus;
  imageUrl?: string;
}

export interface JapanStay {
  id: string;
  hostId: string;
  location: string;
  description: string;
  creditCost: number;
  imageUrl: string;
  availableDates: string[];
  reviews: Review[]; // 新增：旅客評論
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
