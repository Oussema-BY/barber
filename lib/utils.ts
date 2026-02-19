import { CURRENCY } from './constants';

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string (ISO format) to readable date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a time string (HH:mm) to readable format
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(2000, 0, 1, hour, minute));
}

/**
 * Format a date and time together
 */
export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date in YYYY-MM-DD format (local time)
 */
export function getTodayDate(): string {
  return formatDateISO(new Date());
}

/**
 * Get a date N days from now in YYYY-MM-DD format (local time)
 */
export function getDateFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateISO(date);
}

/**
 * Get day name from date string
 */
export function getDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
}

/**
 * Get short day name from date string
 */
export function getShortDayName(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes
    .filter((cls) => typeof cls === 'string')
    .join(' ');
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Parse time string to minutes from midnight
 */
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes from midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Check if two times overlap given durations
 */
export function timesOverlap(
  time1: string,
  duration1: number,
  time2: string,
  duration2: number
): boolean {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + duration1;
  const start2 = timeToMinutes(time2);
  const end2 = start2 + duration2;

  return !(end1 <= start2 || end2 <= start1);
}

/**
 * Get available time slots for a given date
 */
export function getAvailableTimeSlots(
  openTime: number,
  closeTime: number,
  slotDuration: number,
  bookedSlots: Array<{ time: string; duration: number }>
): string[] {
  const slots: string[] = [];

  for (let minutes = openTime * 60; minutes < closeTime * 60; minutes += slotDuration) {
    const time = minutesToTime(minutes);
    const isAvailable = !bookedSlots.some((slot) =>
      timesOverlap(time, slotDuration, slot.time, slot.duration)
    );

    if (isAvailable) {
      slots.push(time);
    }
  }

  return slots;
}

/**
 * Sort array of objects by date property
 */
export function sortByDate<T extends Record<string, any>>(
  items: T[],
  dateKey: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateKey] as string).getTime();
    const dateB = new Date(b[dateKey] as string).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Group array of objects by a property
 */
export function groupBy<T extends Record<string, any>>(
  items: T[],
  key: keyof T
): Record<string | number, T[]> {
  return items.reduce(
    (result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string | number, T[]>
  );
}

/**
 * Calculate total from items with price and quantity
 */
export function calculateTotal(
  items: Array<{ price: number; quantity?: number }>
): number {
  return items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
