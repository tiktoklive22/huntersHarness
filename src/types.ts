export type ShiftType = '06h00 --> 14h00' | '14h00 --> 22h00' | '22h00 --> 06h00';

export interface Category {
  id: string;
  name: string;
  color: string; // e.g. 'emerald', 'amber', 'blue', 'orange', 'teal', 'purple', 'red', 'sky', 'indigo', 'violet', 'pink', 'rose', 'cyan'
  icon: string; // 'check', 'clock', 'truck', 'corner-down-right', 'refresh-cw', 'grid', 'users', 'map-pin', 'star', 'clipboard', 'alert-triangle', 'shield', 'wrench', 'box'
  meaning?: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface KSKItem {
  id: string;
  kskNumber: string;
  categoryId: string;
  date: string; // DD/MM/YYYY
  shift: ShiftType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type DisplayMode = 'vertical' | 'oneline';

export interface ToastMessage {
  id: string;
  title: string;
  type?: 'success' | 'error' | 'info';
}
