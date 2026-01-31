// User Types
export type UserRole = 'owner' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

// Service Types
export type ServiceCategory = 'hair' | 'beard' | 'face' | 'package' | 'other';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  duration: number; // in minutes
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Appointment Types
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO format YYYY-MM-DD
  time: string; // HH:mm format
  duration: number; // in minutes
  price: number;
  status: AppointmentStatus;
  staffMemberId?: string;
  staffMemberName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Product/Inventory Types
export interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  unit?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

// Expense Types
export type ExpenseCategory = 'rent' | 'utilities' | 'products' | 'wages' | 'other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // ISO format
  description?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// POS Transaction Types
export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product' | 'custom';
  serviceId?: string;
  productId?: string;
}

export interface POSTransaction {
  id: string;
  items: BasketItem[];
  clientName?: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  date: string;
  time: string;
  completedBy?: string;
  notes?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  todayAppointments: number;
  dailyRevenue: number;
  lowStockProducts: number;
  totalCustomers: number;
  thisMonthRevenue: number;
  thisMonthExpenses: number;
  averageServiceDuration: number;
}

// Working Hours Types
export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string; // HH:mm
  close: string; // HH:mm
  isClosed: boolean;
}

// Business Settings Types
export interface BusinessSettings {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress: string;
  businessCity: string;
  businessZipCode: string;
  workingHours: WorkingHours[];
  currency: string;
  timezone: string;
  taxRate: number;
}
