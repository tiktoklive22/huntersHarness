import { Category, KSKItem, ShiftType } from '../types';
import { getCurrentShiftAndDate } from './dateUtils';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_on_board',
    name: 'ON BOARD',
    color: 'emerald',
    icon: 'check',
    meaning: 'On Board',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_wait_dpt',
    name: 'WAIT DPT',
    color: 'amber',
    icon: 'clock',
    meaning: 'Waiting Departure',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_dpt',
    name: 'DPT',
    color: 'blue',
    icon: 'truck',
    meaning: 'Departure',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_wait_ept',
    name: 'WAIT EPT',
    color: 'orange',
    icon: 'clock',
    meaning: 'Waiting Entry Point',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_ept',
    name: 'EPT',
    color: 'teal',
    icon: 'corner-down-right',
    meaning: 'Entry Point',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_wait_rework',
    name: 'WAIT REWORK',
    color: 'purple',
    icon: 'clock',
    meaning: 'Waiting Rework',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_rework',
    name: 'REWORK',
    color: 'red',
    icon: 'refresh-cw',
    meaning: 'Rework',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_wait_audit',
    name: 'WAIT AUDIT',
    color: 'sky',
    icon: 'clock',
    meaning: 'Waiting Audit',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_audit',
    name: 'AUDIT',
    color: 'indigo',
    icon: 'grid',
    meaning: 'Audit',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_wait_vk',
    name: 'WAIT VK',
    color: 'blue',
    icon: 'users',
    meaning: 'Validation / VK',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_near_hls',
    name: 'NEAR HLS',
    color: 'purple',
    icon: 'map-pin',
    meaning: 'Near Harness Line Side',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_sr4_hls',
    name: 'SR4 HLS',
    color: 'pink',
    icon: 'star',
    meaning: 'SR4 Harness Line Side',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY_CATEGORIES = 'ksk_app_categories_v2';
const STORAGE_KEY_KSKS = 'ksk_app_items_v2';
const STORAGE_KEY_DISPLAY_MODE = 'ksk_app_display_mode_v2';
const STORAGE_KEY_ACTIVE_DATE = 'ksk_app_active_date_v2';
const STORAGE_KEY_ACTIVE_SHIFT = 'ksk_app_active_shift_v2';

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load categories from localStorage:', e);
  }
  return DEFAULT_CATEGORIES;
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

  // Generate initial seed data for the current session so the user sees a rich, working dashboard right away
  const current = getCurrentShiftAndDate();
  const seedItems: KSKItem[] = [
    // ON BOARD
    { id: '1', kskNumber: '4000888', categoryId: 'cat_on_board', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', kskNumber: '4001426', categoryId: 'cat_on_board', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', kskNumber: '4001077', categoryId: 'cat_on_board', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', kskNumber: '4001725', categoryId: 'cat_on_board', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', kskNumber: '4001420', categoryId: 'cat_on_board', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', kskNumber: '4001890', categoryId: 'cat_on_board', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    
    // WAIT DPT
    { id: '7', kskNumber: '4001045', categoryId: 'cat_wait_dpt', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '8', kskNumber: '4001192', categoryId: 'cat_wait_dpt', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // DPT
    { id: '9', kskNumber: '4001135', categoryId: 'cat_dpt', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '10', kskNumber: '4001028', categoryId: 'cat_dpt', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '11', kskNumber: '4001550', categoryId: 'cat_dpt', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // WAIT EPT
    { id: '12', kskNumber: '4001330', categoryId: 'cat_wait_ept', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // EPT
    { id: '13', kskNumber: '4001602', categoryId: 'cat_ept', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '14', kskNumber: '4001991', categoryId: 'cat_ept', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // WAIT REWORK
    { id: '15', kskNumber: '4000912', categoryId: 'cat_wait_rework', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // REWORK
    { id: '16', kskNumber: '4000784', categoryId: 'cat_rework', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // AUDIT
    { id: '17', kskNumber: '4001205', categoryId: 'cat_audit', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '18', kskNumber: '4001418', categoryId: 'cat_audit', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // WAIT VK
    { id: '19', kskNumber: '4001882', categoryId: 'cat_wait_vk', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // NEAR HLS
    { id: '20', kskNumber: '4001644', categoryId: 'cat_near_hls', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '21', kskNumber: '4001710', categoryId: 'cat_near_hls', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

    // SR4 HLS
    { id: '22', kskNumber: '4001804', categoryId: 'cat_sr4_hls', date: current.date, shift: current.shift, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  saveStoredKSKs(seedItems);
  return seedItems;
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

export function saveStoredActiveDate(date: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_DATE, date);
  } catch (e) {}
}

export function getStoredActiveShift(): ShiftType | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_SHIFT);
    if (raw === '06h00 --> 14h00' || raw === '14h00 --> 22h00' || raw === '22h00 --> 06h00') {
      return raw;
    }
  } catch (e) {}
  return null;
}

export function saveStoredActiveShift(shift: ShiftType): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SHIFT, shift);
  } catch (e) {}
}
