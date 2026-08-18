import { ShiftType } from '../types';

export const SHIFT_OPTIONS: ShiftType[] = [
  '06h00 --> 14h00',
  '14h00 --> 22h00',
  '22h00 --> 06h00',
];

export function getShiftDisplayName(shift: ShiftType): string {
  switch (shift) {
    case '06h00 --> 14h00':
      return 'Shift 1 (06h00 → 14h00)';
    case '14h00 --> 22h00':
      return 'Shift 2 (14h00 → 22h00)';
    case '22h00 --> 06h00':
      return 'Shift 3 (22h00 → 06h00)';
    default:
      return String(shift).replace('-->', '→');
  }
}

export function getShiftShortName(shift: ShiftType): string {
  switch (shift) {
    case '06h00 --> 14h00':
      return 'Shift 1';
    case '14h00 --> 22h00':
      return 'Shift 2';
    case '22h00 --> 06h00':
      return 'Shift 3';
    default:
      return shift;
  }
}

/**
 * Format a Date object to DD/MM/YYYY
 */
export function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Convert standard YYYY-MM-DD (input[type="date"]) to DD/MM/YYYY
 */
export function isoToDDMMYYYY(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Convert DD/MM/YYYY to YYYY-MM-DD (for input[type="date"])
 */
export function ddmmYYYYToISO(ddmmyyyy: string): string {
  if (!ddmmyyyy) return '';
  const parts = ddmmyyyy.split('/');
  if (parts.length !== 3) return ddmmyyyy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/**
 * Detect current production date and shift based on current time
 */
export function getCurrentShiftAndDate(): { date: string; shift: ShiftType; timeStr: string } {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${String(hours).padStart(2, '0')}:${minutes}`;

  let shift: ShiftType;
  const productionDate = new Date(now);

  if (hours >= 6 && hours < 14) {
    shift = '06h00 --> 14h00';
  } else if (hours >= 14 && hours < 22) {
    shift = '14h00 --> 22h00';
  } else {
    shift = '22h00 --> 06h00';
    // If it's early morning (00:00 - 05:59), this night shift belongs to yesterday's production start
    if (hours < 6) {
      productionDate.setDate(productionDate.getDate() - 1);
    }
  }

  return {
    date: formatDateDDMMYYYY(productionDate),
    shift,
    timeStr,
  };
}

/**
 * Get detailed shift time window description, taking care of night shift crossing midnight
 */
export function getShiftWindowLabel(dateStr: string, shift: ShiftType): string {
  if (!dateStr) return '';
  if (shift !== '22h00 --> 06h00') {
    return `${dateStr} (${shift.replace('-->', '→')})`;
  }

  // Night shift crossing midnight:
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const startDate = new Date(year, month, day);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const nextDateStr = formatDateDDMMYYYY(nextDate);
    return `${dateStr} 22:00 → ${nextDateStr} 06:00`;
  }

  return `${dateStr} 22:00 → Next Day 06:00`;
}
