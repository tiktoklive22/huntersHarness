import { Category, KSKItem, ShiftType } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [];

const STORAGE_KEY_CATEGORIES = 'ksk_app_categories_v4';
const STORAGE_KEY_KSKS = 'ksk_app_items_v4';
const STORAGE_KEY_DISPLAY_MODE = 'ksk_app_display_mode_v3';
const STORAGE_KEY_ACTIVE_DATE = 'ksk_app_active_date_v3';
const STORAGE_KEY_ACTIVE_SHIFT = 'ksk_app_active_shift_v3';

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load categories from localStorage:', e);
  }
  return [];
}

export function saveStoredCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
}

export function getStoredKSKs(): KSKItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KSKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load KSK items from localStorage:', e);
  }
  return [];
}

export function saveStoredKSKs(ksks: KSKItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_KSKS, JSON.stringify(ksks));
  } catch (e) {
    console.error('Failed to save KSK items:', e);
  }
}

export function getStoredDisplayMode(): 'vertical' | 'oneline' {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISPLAY_MODE);
    if (raw === 'vertical' || raw === 'oneline') return raw;
  } catch (e) {}
  return 'oneline';
}

export function saveStoredDisplayMode(mode: 'vertical' | 'oneline'): void {
  try {
    localStorage.setItem(STORAGE_KEY_DISPLAY_MODE, mode);
  } catch (e) {}
}

export function getStoredActiveDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_DATE);
  } catch (e) {
    return null;
  }
}

export function saveStoredActiveDate(dateStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_DATE, dateStr);
  } catch (e) {}
}

export function getStoredActiveShift(): ShiftType | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_SHIFT) as ShiftType | null;
  } catch (e) {
    return null;
  }
}

export function saveStoredActiveShift(shift: ShiftType): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SHIFT, shift);
  } catch (e) {}
}
