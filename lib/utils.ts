import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserDataType } from '@/schemaValidation/auth.schema';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Locale } from 'date-fns';
import { Product } from '@/app/products/page';

export interface DecodedToken extends JwtPayload {
  phone: string;
  role_id: number;
  iat: number;
  exp: number;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export function writeLocalUser(items: UserDataType) {
  localStorage.setItem('userInfo', JSON.stringify(items));
}

export function getLocalUser(): UserDataType | undefined {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userInfo = window.localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Error parsing local user:', error);
        writeLocalUser({} as UserDataType);
        return undefined;
      }
    }
  }
}

export function getLocalToken() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('sessionToken');
  }
}

export function resetLocalData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('sessionToken');
    window.localStorage.removeItem('userInfo');
    window.localStorage.removeItem('firstOrderId');
  }
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

type DateFormatter = (
  date: Date,
  options?: { locale?: Locale },
) => React.ReactNode;

export const formatDateToVietnamese: DateFormatter = (date) => {
  const dayOfWeek = date.getDay();
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return dayNames[dayOfWeek];
};

export function formatDateToString(date: Date): string {
  const day = date?.getDate().toString().padStart(2, '0');
  const month = (date?.getMonth() + 1).toString().padStart(2, '0');
  const year = date?.getFullYear();

  return `${day}/${month}/${year}`;
}

export const addToCart = (product: Product, quantity?: number) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const cart: { products: CartItem[] } = JSON.parse(
      localStorage.getItem('cart') || '{ "products": [] }',
    );

    const existingProduct = cart.products.find(
      (item) => item.product_id === product.id,
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity ? quantity : 1,
        image: product.image,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    console.warn('localStorage is not available.');
  }
};

export const updateLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('cart', JSON.stringify({ products: items }));
  }
};
