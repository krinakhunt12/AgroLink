// Type definitions for AgroLink application
import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  location: string;
  image: string;
  rating?: number;
  isNegotiable?: boolean;
  isVerified?: boolean;
  stock?: number;
  description?: string;
  farmerName?: string;
  status?: 'active' | 'sold';
  farmer?: {
    id: string;
    _id?: string;
    name: string;
    phone?: string;
    rating?: number;
  };
}

export interface Bid {
  id: string;
  productId: string;
  buyerName: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export const UserType = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  ADMIN: 'admin',
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export interface User {
  id: string;
  _id?: string;
  name: string;
  phone?: string;
  email?: string;
  userType: UserType;
  location?: string;
  isVerified: boolean;
  avatar?: string | null;
  rating: number;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  language: 'en' | 'gu' | 'hi';
}

export interface Order {
  id: string;
  _id?: string;
  product: Product | string;
  buyer: User | string;
  farmer: User | string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: 'cash' | 'upi' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
  blockchainHash?: string;
  blockchainVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  label: string;
  translationKey: string;
  path: string;
  icon?: LucideIcon;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channel: string;
  category: string;
}
