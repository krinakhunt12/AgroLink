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
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

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
