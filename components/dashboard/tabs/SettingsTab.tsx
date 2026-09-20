'use client';

import React, { useState } from 'react';
import {useApp} from '../../../context/AppContext';
import {BRAND_CONFIG} from '../../../config/brand';
import {Settings, Save, Database, ShieldCheck, CreditCard, MessageSquare, Code2} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { shopName, setShopName, showToast } = useApp();
  const [address, setAddress] = useState(BRAND_CONFIG.sampleShop.address);
  const [phone, setPhone] = useState(BRAND_CONFIG.sampleShop.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Shop Settings Saved', 'Business details updated successfully', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* SHOP SETTINGS FORM */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Barbershop General Settings</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Barbershop Business Name</label>
            <input
              type="text"
              required
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Shop Info</span>
          </button>
        </form>
      </div>

      {/* TECHNICAL ARCHITECTURE & INTEGRATION ROADMAP */}
      <div className="p-6 rounded-2xl bg-linear-to-br from-zinc-900 via-stone-900 to-blue-950/30 border border-blue-500/30 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1">
            <Code2 className="w-4 h-4" /> Technical Integration Roadmap
          </span>
          <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-stone-100">Production Integrations Guide</h3>
          <p className="text-slate-500 dark:text-stone-400 text-xs mt-1">
            This application is built with clean state management and modular interfaces ready for seamless backend hookups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Auth Integration */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>1. User Authentication (Firebase Auth / Clerk)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
              Connect <code className="text-blue-700 dark:text-blue-300">Firebase Auth</code> or <code className="text-blue-700 dark:text-blue-300">Clerk</code> in <code className="text-slate-700 dark:text-stone-300">src/context/AppContext.tsx</code> to support shop owner logins, barber pin codes, and customer sign-ins.
            </p>
          </div>

          {/* Database Integration */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>2. Real-Time Database (Cloud Firestore / PostgreSQL)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
              Replace initial mock state in <code className="text-slate-700 dark:text-stone-300">src/data/mockData.ts</code> with Firestore listeners on collections <code className="text-blue-700 dark:text-blue-300">appointments</code>, <code className="text-blue-700 dark:text-blue-300">walkIns</code>, and <code className="text-blue-700 dark:text-blue-300">clients</code> for multi-device sync.
            </p>
          </div>

          {/* Payment Gateway */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>3. Online Payments & POS Terminal (Stripe / Square)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
              Hook up <code className="text-blue-700 dark:text-blue-300">Stripe PaymentIntents</code> in <code className="text-slate-700 dark:text-stone-300">src/components/booking/CustomerBooking.tsx</code> for online deposits and Square Terminal SDK in the POS register.
            </p>
          </div>

          {/* WhatsApp / SMS Gateway */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>4. WhatsApp & SMS Messaging (Twilio / Meta Business API)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 leading-relaxed">
              Connect Twilio or WhatsApp Cloud API endpoints in server routes to automatically fire 2-hour appointment reminders and receipt alerts.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
