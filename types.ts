/**
 * Shared domain types for the Trimly barbershop OS.
 */

/* ---------------------------------- Shell --------------------------------- */

export type AppView = 'marketing' | 'booking' | 'dashboard';

export type DashboardTab =
  | 'overview'
  | 'calendar'
  | 'walkins'
  | 'clients'
  | 'services'
  | 'staff'
  | 'pos'
  | 'inventory'
  | 'marketing'
  | 'reports'
  | 'settings';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

/* --------------------------------- Catalog -------------------------------- */

export type ServiceCategory =
  | 'Hair'
  | 'Beard'
  | 'Combos & Packages'
  | 'Treatments & Extras';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
}

/* ---------------------------------- Staff --------------------------------- */

export interface Barber {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  bio: string;
  isAvailable: boolean;
  commissionRate: number;
  workingHours: string;
}

export interface StaffPerformance {
  barberId: string;
  appointmentsCount: number;
  servicesRevenue: number;
  productSalesRevenue: number;
  tipsEarned: number;
  commissionEarned: number;
  occupancyPercentage: number;
  avgRating: number;
}

/* ------------------------------- Appointments ------------------------------ */

export type AppointmentStatus =
  | 'confirmed'
  | 'checked-in'
  | 'in-chair'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface Appointment {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  depositAmount: number;
  status: AppointmentStatus;
  notes?: string;
  chairNumber?: number;
  createdAt: string;
}

/* --------------------------------- Walk-ins -------------------------------- */

export type WalkInStatus = 'waiting' | 'in-chair' | 'completed' | 'no-show';

export interface WalkIn {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  /** A barber id, or `'any'` for no preference. */
  preferredBarberId: string;
  estimatedWaitMinutes: number;
  status: WalkInStatus;
  checkInTime: string;
  chairNumber?: number;
  notes?: string;
}

/* ---------------------------------- Clients -------------------------------- */

export type LoyaltyTier = 'Silver' | 'Gold' | 'VIP Platinum';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  preferredBarberId: string;
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  formulaNotes: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  marketingConsent: boolean;
}

/* -------------------------------- Inventory -------------------------------- */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  reorderThreshold: number;
  sku: string;
  image: string;
}

/* ----------------------------------- POS ----------------------------------- */

export type PaymentMethod = 'Card' | 'Cash' | 'Apple Pay' | 'Loyalty Points';

export interface SaleItem {
  id: string;
  type: 'service' | 'product';
  name: string;
  price: number;
  quantity: number;
}

export interface SaleRecord {
  id: string;
  receiptNumber: string;
  customerName: string;
  barberId: string;
  barberName: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  tipAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
}

/* -------------------------------- Marketing -------------------------------- */

export interface MarketingCampaign {
  id: string;
  title: string;
  triggerEvent: string;
  messageTemplate: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  isActive: boolean;
  sentCount: number;
  conversionRate: string;
}
