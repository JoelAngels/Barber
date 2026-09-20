'use client';

import React, { useState } from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {useApp} from '../../context/AppContext';
import {DashboardTab} from '../../types';
import {BRAND_CONFIG} from '../../config/brand';

// Sub-tabs imports
import {OverviewTab} from './tabs/OverviewTab';
import {CalendarTab} from './tabs/CalendarTab';
import {WalkInsTab} from './tabs/WalkInsTab';
import {ClientsTab} from './tabs/ClientsTab';
import {StaffTab} from './tabs/StaffTab';
import {ServicesTab} from './tabs/ServicesTab';
import {SalesPosTab} from './tabs/SalesPosTab';
import {InventoryTab} from './tabs/InventoryTab';
import {MarketingTab} from './tabs/MarketingTab';
import {ReportsTab} from './tabs/ReportsTab';
import {SettingsTab} from './tabs/SettingsTab';

import {LayoutDashboard, Calendar, Users, UserCheck, Scissors, CreditCard, ShoppingBag, MessageSquare, BarChart3, Settings, Plus, Menu, X} from 'lucide-react';

export const ShopDashboard: React.FC = () => {
  const { 
    dashboardTab, 
    setDashboardTab, 
    selectedLocationId,
    setSelectedLocationId,
    setQuickWalkInModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'walkins', label: 'Walk-in Queue', icon: Users },
    { id: 'clients', label: 'Clients CRM', icon: UserCheck },
    { id: 'staff', label: 'Staff Management', icon: Scissors },
    { id: 'services', label: 'Services Menu', icon: Scissors },
    { id: 'pos', label: 'Inventory & POS', icon: CreditCard },
    { id: 'inventory', label: 'Inventory Stock', icon: ShoppingBag },
    { id: 'marketing', label: 'WhatsApp Marketing', icon: MessageSquare },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'settings', label: 'Shop Settings', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100dvh-5rem)] bg-[#FDFCFB] dark:bg-[#121212] text-[#1A1A1A] dark:text-stone-100 flex flex-col md:flex-row md:items-start">
      
      {/* MOBILE DASHBOARD TOP BAR */}
      <div className="md:hidden p-4 bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4">TRIMLY.</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-white/50">The Gentlemen’s Cut</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION - EDITORIAL AESTHETIC */}
      <aside
        className={`w-full md:w-64 bg-white dark:bg-[#1A1A1A] text-slate-800 dark:text-white p-6 shrink-0 flex flex-col justify-between gap-6 border-r border-slate-200 dark:border-white/10 md:sticky md:top-20 md:h-[calc(100dvh-5rem)] md:overflow-hidden ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6 md:flex-1 md:min-h-0 md:overflow-y-auto scrollbar-thin -mx-1 px-1">
          
          {/* Editorial Brand Title */}
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4">TRIMLY.</h1>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/40">The Gentlemen’s Cut • London</p>
          </div>

          {/* Location Selector */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-wider block">Shop Branch</span>
            <select
              value={selectedLocationId}
              onChange={e => setSelectedLocationId(e.target.value)}
              className="w-full mt-1 bg-transparent text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer"
            >
              {BRAND_CONFIG.locations.map(loc => (
                <option key={loc.id} value={loc.id} className="bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = dashboardTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setDashboardTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-white/60'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Shop Pulse Card */}
        <div className="shrink-0 rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-200 dark:border-blue-800/40">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Shop Pulse</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white">84%</span>
            <span className="text-[10px] text-slate-500 dark:text-white/60">Occupancy</span>
          </div>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col min-h-[calc(100dvh-5rem)] bg-[#FDFCFB] dark:bg-[#121212]">
        
        {/* EDITORIAL TOP BAR */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 sm:px-8 bg-white dark:bg-[#1A1A1A]">
          <div className="flex items-baseline gap-4">
            <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">
              {navItems.find(i => i.id === dashboardTab)?.label ?? 'Overview'}
            </h2>
            <span className="text-xs text-slate-500 dark:text-white/40 font-medium hidden sm:inline">
              Wednesday, 22 July 2026
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-10 items-center space-x-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#262626] px-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] dark:text-stone-200">Shop Status: Open</span>
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></div>
            </div>

            <button
              onClick={() => setQuickWalkInModalOpen(true)}
              className="flex h-10 items-center space-x-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-6 font-bold shadow-lg shadow-blue-600/20 transition-all text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Booking</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="p-6 sm:p-8 flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {dashboardTab === 'overview' && <OverviewTab />}
              {dashboardTab === 'calendar' && <CalendarTab />}
              {dashboardTab === 'walkins' && <WalkInsTab />}
              {dashboardTab === 'clients' && <ClientsTab />}
              {dashboardTab === 'staff' && <StaffTab />}
              {dashboardTab === 'services' && <ServicesTab />}
              {dashboardTab === 'pos' && <SalesPosTab />}
              {dashboardTab === 'inventory' && <InventoryTab />}
              {dashboardTab === 'marketing' && <MarketingTab />}
              {dashboardTab === 'reports' && <ReportsTab />}
              {dashboardTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
};
