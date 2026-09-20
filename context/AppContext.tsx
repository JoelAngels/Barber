'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { 
  AppView, 
  DashboardTab, 
  Appointment, 
  AppointmentStatus, 
  WalkIn, 
  WalkInStatus, 
  Client, 
  Service, 
  Product, 
  SaleRecord, 
  ToastMessage,
  Barber
} from '../types';
import { 
  INITIAL_APPOINTMENTS, 
  INITIAL_WALKINS, 
  INITIAL_CLIENTS, 
  INITIAL_SERVICES, 
  INITIAL_PRODUCTS, 
  INITIAL_BARBERS, 
  INITIAL_SALES 
} from '../data/mockData';
import { BRAND_CONFIG } from '../config/brand';

interface AppContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  dashboardTab: DashboardTab;
  setDashboardTab: (tab: DashboardTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  shopName: string;
  setShopName: (name: string) => void;
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'bookingCode' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;

  walkIns: WalkIn[];
  addWalkIn: (walkIn: Omit<WalkIn, 'id' | 'ticketNumber' | 'checkInTime'>) => WalkIn;
  updateWalkInStatus: (id: string, status: WalkInStatus) => void;

  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'loyaltyPoints' | 'loyaltyTier'>) => Client;
  updateClientNotes: (clientId: string, formulaNotes: string) => void;

  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;

  products: Product[];
  updateProductStock: (id: string, change: number) => void;

  barbers: Barber[];

  sales: SaleRecord[];
  addSaleRecord: (sale: Omit<SaleRecord, 'id' | 'receiptNumber' | 'timestamp'>) => void;

  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  quickWalkInModalOpen: boolean;
  setQuickWalkInModalOpen: (open: boolean) => void;
  quickAppointmentModalOpen: boolean;
  setQuickAppointmentModalOpen: (open: boolean) => void;
  tvModeOpen: boolean;
  setTvModeOpen: (open: boolean) => void;
}

/**
 * ID/code generation lives at module scope: `Date.now()` and `Math.random()`
 * are impure, and React's compiler rules forbid calling them from a component
 * body. These are only ever invoked from event handlers.
 */
const uid = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const bookingCode = (): string => `TRM-${Math.floor(1000 + Math.random() * 9000)}`;

const receiptNo = (): string =>
  `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

/**
 * Theme lives on the <html> element, not in React state. The inline bootstrap
 * script in the root layout sets the class before first paint, so the DOM is
 * the source of truth and `useSyncExternalStore` can read it without a
 * hydration mismatch (the server snapshot is always 'light', matching SSR).
 */
type Theme = 'dark' | 'light';

const themeListeners = new Set<() => void>();

const themeStore = {
  subscribe(cb: () => void) {
    themeListeners.add(cb);
    return () => {
      themeListeners.delete(cb);
    };
  },
  getSnapshot(): Theme {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  },
  getServerSnapshot(): Theme {
    return 'light';
  },
};

const applyTheme = (next: Theme) => {
  document.documentElement.classList.toggle('dark', next === 'dark');
  try {
    localStorage.setItem('trimly_theme', next);
  } catch {
    // Private mode or blocked storage: the theme still applies for this session.
  }
  themeListeners.forEach(cb => cb());
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('marketing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const [shopName, setShopName] = useState<string>(BRAND_CONFIG.sampleShop.name);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-1');

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [walkIns, setWalkIns] = useState<WalkIn[]>(INITIAL_WALKINS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [barbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_SALES);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [quickWalkInModalOpen, setQuickWalkInModalOpen] = useState<boolean>(false);
  const [quickAppointmentModalOpen, setQuickAppointmentModalOpen] = useState<boolean>(false);
  const [tvModeOpen, setTvModeOpen] = useState<boolean>(false);


  const toggleTheme = () => {
    applyTheme(themeStore.getSnapshot() === 'dark' ? 'light' : 'dark');
  };

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = uid('toast');
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'bookingCode' | 'createdAt'>): Appointment => {
    const newCode = bookingCode();
    const newApt: Appointment = {
      ...aptData,
      id: uid('apt'),
      bookingCode: newCode,
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newApt, ...prev]);
    showToast('Appointment Booked', `Code ${newCode} confirmed for ${aptData.customerName}`, 'success');
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast('Status Updated', `Appointment status set to ${status}`, 'info');
  };

  const addWalkIn = (walkInData: Omit<WalkIn, 'id' | 'ticketNumber' | 'checkInTime'>): WalkIn => {
    const nextTicketNum = `W-0${walkIns.length + 1}`;
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 5);

    const newWalkIn: WalkIn = {
      ...walkInData,
      id: uid('walk'),
      ticketNumber: nextTicketNum,
      checkInTime: timeStr,
    };
    setWalkIns(prev => [...prev, newWalkIn]);
    showToast('Walk-in Ticket Issued', `Ticket #${nextTicketNum} created for ${walkInData.customerName}`, 'success');
    return newWalkIn;
  };

  const updateWalkInStatus = (id: string, status: WalkInStatus) => {
    setWalkIns(prev =>
      prev.map(w => (w.id === id ? { ...w, status } : w))
    );
    showToast('Queue Updated', `Ticket status set to ${status}`, 'info');
  };

  const addClient = (clientData: Omit<Client, 'id' | 'totalVisits' | 'totalSpent' | 'loyaltyPoints' | 'loyaltyTier'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: uid('cli'),
      totalVisits: 1,
      totalSpent: 0,
      loyaltyPoints: 20,
      loyaltyTier: 'Silver',
    };
    setClients(prev => [newClient, ...prev]);
    showToast('Client Created', `${clientData.name} added to CRM`, 'success');
    return newClient;
  };

  const updateClientNotes = (clientId: string, formulaNotes: string) => {
    setClients(prev =>
      prev.map(c => (c.id === clientId ? { ...c, formulaNotes } : c))
    );
    showToast('Formula Saved', 'Client formula notes updated', 'success');
  };

  const addService = (srv: Omit<Service, 'id'>) => {
    const newSrv: Service = { ...srv, id: uid('srv') };
    setServices(prev => [...prev, newSrv]);
    showToast('Service Added', `${srv.name} added to menu`, 'success');
  };

  const updateService = (updatedSrv: Service) => {
    setServices(prev => prev.map(s => s.id === updatedSrv.id ? updatedSrv : s));
    showToast('Service Saved', `${updatedSrv.name} details updated`, 'success');
  };

  const updateProductStock = (id: string, change: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + change) } : p))
    );
    showToast('Stock Adjusted', 'Inventory quantity updated', 'info');
  };

  const addSaleRecord = (saleData: Omit<SaleRecord, 'id' | 'receiptNumber' | 'timestamp'>) => {
    const receiptNumber = receiptNo();
    const newSale: SaleRecord = {
      ...saleData,
      id: uid('sale'),
      receiptNumber,
      timestamp: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);
    showToast('Payment Completed', `Receipt ${receiptNumber} generated - Total $${saleData.totalAmount.toFixed(2)}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        dashboardTab,
        setDashboardTab,
        theme,
        toggleTheme,
        shopName,
        setShopName,
        selectedLocationId,
        setSelectedLocationId,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        walkIns,
        addWalkIn,
        updateWalkInStatus,
        clients,
        addClient,
        updateClientNotes,
        services,
        addService,
        updateService,
        products,
        updateProductStock,
        barbers,
        sales,
        addSaleRecord,
        toasts,
        showToast,
        removeToast,
        quickWalkInModalOpen,
        setQuickWalkInModalOpen,
        quickAppointmentModalOpen,
        setQuickAppointmentModalOpen,
        tvModeOpen,
        setTvModeOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
