export type AppCategory =
  | 'Apps'
  | 'Games'
  | 'Tools'
  | 'Social'
  | 'Entertainment'
  | 'Education'
  | 'Other';

export interface AppItem {
  id: string;
  name: string;
  image: string; // Converted Base64 / Data URL image or external url
  imageUrl: string; // Backwards-compatible duplicate
  category: AppCategory;
  description: string;
  version: string;
  developer: string;
  link: string; // Download or visit link
  downloadUrl: string; // Backwards-compatible duplicate
  createdAt: number;
  isCustom?: boolean;
}

export interface AppFormData {
  name: string;
  image: string; // Base64 data URL or url
  imageUrl?: string;
  category: AppCategory;
  description: string;
  version: string;
  developer: string;
  link: string;
  downloadUrl?: string;
  imageFileName?: string;
}

export interface FormErrors {
  name?: string;
  image?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  version?: string;
  developer?: string;
  link?: string;
  downloadUrl?: string;
}

export type NavTab = 'home' | 'apps' | 'games' | 'categories' | 'manage';
