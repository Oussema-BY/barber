import {
  BarChart3,
  Calendar,
  Home,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import type { Service, Appointment, Product, Expense, WorkingHours } from './types';

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
  },
  {
    label: 'Appointments',
    href: '/appointments',
    icon: Calendar,
  },
  {
    label: 'Services',
    href: '/services',
    icon: Zap,
  },
  {
    label: 'POS',
    href: '/pos',
    icon: ShoppingCart,
  },
  {
    label: 'Inventory',
    href: '/inventory',
    icon: Users,
  },
  {
    label: 'Finance',
    href: '/finance',
    icon: BarChart3,
  },
  {
    label: 'Insights',
    href: '/insights',
    icon: TrendingUp,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

// Service Categories
export const SERVICE_CATEGORIES = ['hair', 'beard', 'face', 'package', 'other'] as const;

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

// Mock Data
export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Classic Haircut',
    category: 'hair',
    price: 25,
    duration: 30,
    description: 'Traditional haircut with styling',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Beard Trim',
    category: 'beard',
    price: 15,
    duration: 20,
    description: 'Professional beard trimming and shaping',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Facial Care',
    category: 'face',
    price: 20,
    duration: 25,
    description: 'Express facial treatment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Barber King Package',
    category: 'package',
    price: 50,
    duration: 60,
    description: 'Complete grooming package: haircut, beard trim, and facial',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Hair Color',
    category: 'hair',
    price: 45,
    duration: 90,
    description: 'Professional hair coloring service',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    clientName: 'John Doe',
    clientPhone: '555-0101',
    serviceId: '1',
    serviceName: 'Classic Haircut',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    price: 25,
    status: 'confirmed',
    staffMemberId: 'staff-1',
    staffMemberName: 'Mike',
    notes: 'Regular customer, prefers fade',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    clientName: 'Jane Smith',
    clientPhone: '555-0102',
    serviceId: '2',
    serviceName: 'Beard Trim',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    duration: 20,
    price: 15,
    status: 'pending',
    staffMemberId: 'staff-2',
    staffMemberName: 'Alex',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    clientName: 'Bob Johnson',
    clientPhone: '555-0103',
    serviceId: '4',
    serviceName: 'Barber King Package',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 60,
    price: 50,
    status: 'confirmed',
    staffMemberId: 'staff-1',
    staffMemberName: 'Mike',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Hair Gel',
    category: 'Styling',
    supplier: 'Barber Supply Co',
    costPrice: 5,
    salePrice: 15,
    quantity: 12,
    minQuantity: 5,
    unit: 'pcs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Beard Oil',
    category: 'Grooming',
    supplier: 'Grooming Essentials',
    costPrice: 8,
    salePrice: 25,
    quantity: 4,
    minQuantity: 5,
    unit: 'pcs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Shampoo Bottle',
    category: 'Hair Care',
    supplier: 'Pro Care',
    costPrice: 3,
    salePrice: 10,
    quantity: 20,
    minQuantity: 8,
    unit: 'pcs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Clipper Oil',
    category: 'Maintenance',
    supplier: 'Tool Care',
    costPrice: 2,
    salePrice: 6,
    quantity: 2,
    minQuantity: 3,
    unit: 'pcs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Monthly Rent',
    category: 'rent',
    amount: 2000,
    date: new Date().toISOString().split('T')[0],
    description: 'Shop rent for January',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Electricity Bill',
    category: 'utilities',
    amount: 150,
    date: new Date().toISOString().split('T')[0],
    description: 'Monthly electricity',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Staff Salaries',
    category: 'wages',
    amount: 1500,
    date: new Date().toISOString().split('T')[0],
    description: 'Monthly salaries for 2 staff members',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Supplies Restock',
    category: 'products',
    amount: 500,
    date: new Date().toISOString().split('T')[0],
    description: 'Hair products and tools',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Time Slots Configuration
export const BUSINESS_HOURS = {
  openTime: 9,
  closeTime: 20,
  timeSlotDuration: 15, // minutes
};

// Currency Formatting
export const CURRENCY = {
  code: 'EUR',
  symbol: '€',
  locale: 'en-EU',
};

// Quick Cash Buttons for POS
export const QUICK_CASH_AMOUNTS = [10, 20, 50];
