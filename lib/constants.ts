import {
  BarChart3,
  Calendar,
  Home,
  LayoutGrid,
  Package as PackageIcon,
  Settings,
  ShoppingCart,
  Users,
  Zap,
} from 'lucide-react';
import type { WorkingHours } from './types';

// Staff Colors for multi-chair mode
export const STAFF_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

// Color Mapping for Categories
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  hair: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  beard: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
  face: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  package: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  other: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
};

// Package Category Colors
export const PACKAGE_CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  mariage: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-200',
  },
  fiancailles: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
  },
  khotba: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-200',
  },
  henna: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  hammam: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
  },
  other: {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
};

// Appointment Status Colors
export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  confirmed: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
};

// Sidebar Navigation
export const MAIN_NAV = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['owner', 'staff'] as const,
  },
  {
    label: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: ['owner', 'staff'] as const,
  },
  {
    label: 'Services',
    href: '/services',
    icon: Zap,
    roles: ['owner', 'staff'] as const,
  },
  {
    label: 'Packages',
    href: '/packages',
    icon: PackageIcon,
    roles: ['owner', 'staff'] as const,
  },
  {
    label: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    roles: ['owner', 'staff'] as const,
  },
  {
    label: 'Inventory',
    href: '/inventory',
    icon: Users,
    roles: ['owner'] as const,
  },
  {
    label: 'Finance',
    href: '/finance',
    icon: BarChart3,
    roles: ['owner'] as const,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['owner'] as const,
  },
];

// Service Categories
export const SERVICE_CATEGORIES = ['hair', 'beard', 'face', 'package', 'other'] as const;

// Package Categories
export const PACKAGE_CATEGORIES = ['mariage', 'fiancailles', 'khotba', 'henna', 'hammam', 'other'] as const;

// Package Genders
export const PACKAGE_GENDERS = ['homme', 'femme', 'mixte'] as const;

// Expense Categories
export const EXPENSE_CATEGORIES = ['rent', 'utilities', 'products', 'wages', 'other'] as const;

// Working Hours Templates
export const DEFAULT_WORKING_HOURS: WorkingHours[] = [
  { day: 'monday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'tuesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'wednesday', open: '09:00', close: '18:00', isClosed: false },
  { day: 'thursday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'friday', open: '09:00', close: '20:00', isClosed: false },
  { day: 'saturday', open: '10:00', close: '18:00', isClosed: false },
  { day: 'sunday', open: '00:00', close: '00:00', isClosed: true },
];

// Time Slots Configuration
export const BUSINESS_HOURS = {
  openTime: 9,
  closeTime: 20,
  timeSlotDuration: 15, // minutes
};

// Currency Formatting
export const CURRENCY = {
  code: 'TND',
  symbol: 'د.ت',
  locale: 'ar-TN',
};

// Quick Cash Buttons for POS
export const QUICK_CASH_AMOUNTS = [5, 10, 20];
