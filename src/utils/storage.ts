import { AppItem } from '../types';
import { SAMPLE_APPS } from '../data/sampleApps';

export const STORAGE_KEY = 'hushapk_apps';

/**
 * Validates that a string is a valid http:// or https:// URL.
 */
export function isValidHttpUrl(stringToTest: string): boolean {
  if (!stringToTest || typeof stringToTest !== 'string') return false;
  const trimmed = stringToTest.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Ensures the URL is strictly safe http or https.
 */
export function sanitizeExternalUrl(url: string): string {
  const trimmed = url.trim();
  if (isValidHttpUrl(trimmed)) {
    return trimmed;
  }
  return '#';
}

/**
 * Loads apps from browser localStorage.
 * If no entry exists in localStorage, returns SAMPLE_APPS as initial state.
 */
export function loadAppsFromStorage(): AppItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: initialize with sample apps so user sees an attractive hub
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPS));
      return SAMPLE_APPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: any) => ({
        ...item,
        image: item.image || item.imageUrl || '',
        imageUrl: item.imageUrl || item.image || '',
        link: item.link || item.downloadUrl || '#',
        downloadUrl: item.downloadUrl || item.link || '#',
      }));
    }
    return [];
  } catch (err) {
    console.error('Failed to load apps from localStorage:', err);
    return SAMPLE_APPS;
  }
}

/**
 * Saves app items to browser localStorage.
 */
export function saveAppsToStorage(apps: AppItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save apps to localStorage:', err);
  }
}

/**
 * Resets storage back to default sample apps.
 */
export function resetToSampleApps(): AppItem[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPS));
    return SAMPLE_APPS;
  } catch (err) {
    console.error('Failed to reset apps:', err);
    return SAMPLE_APPS;
  }
}
