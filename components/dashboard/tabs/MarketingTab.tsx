'use client';

import React, { useState } from 'react';
import {useApp} from '../../../context/AppContext';
import {INITIAL_CAMPAIGN_TEMPLATES} from '../../../data/mockData';
import {MessageSquare, Send, ToggleLeft, ToggleRight} from 'lucide-react';

export const MarketingTab: React.FC = () => {
  const { showToast, clients } = useApp();
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGN_TEMPLATES);
  const [customBroadcast, setCustomBroadcast] = useState('');

  const toggleCampaign = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('Automation Saved', 'Campaign status updated', 'info');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBroadcast) return;
    showToast('WhatsApp Broadcast Triggered', `Sent message to ${clients.length} opted-in clients!`, 'success');
    setCustomBroadcast('');
  };

  return (
    <div className="space-y-6">
      
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>WhatsApp & SMS Marketing Automations</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">Automated 2-hour appointment reminders, no-show reduction, and 4-week re-booking campaigns.</p>
        </div>
      </div>

      {/* AUTOMATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(camp => (
          <div
            key={camp.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 ${
              camp.isActive ? 'bg-white dark:bg-zinc-900 border-blue-500/40 shadow-lg' : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-200 dark:border-zinc-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {camp.channel}
                </span>
                <h3 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-base mt-1">{camp.title}</h3>
              </div>

              <button
                onClick={() => toggleCampaign(camp.id)}
                className="text-slate-500 dark:text-stone-400 hover:text-stone-100 transition-colors"
              >
                {camp.isActive ? (
                  <ToggleRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-600" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-stone-400 font-mono bg-slate-50 dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800/80 leading-relaxed">
              “{camp.messageTemplate}”
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-stone-400 pt-2 border-t border-slate-200 dark:border-zinc-800">
              <span>Trigger: {camp.triggerEvent}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{camp.conversionRate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CUSTOM WHATSAPP BROADCAST TOOL */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Send Instant Broadcast Message to VIP Clients</span>
        </h3>

        <form onSubmit={handleSendBroadcast} className="space-y-3">
          <textarea
            rows={3}
            value={customBroadcast}
            onChange={e => setCustomBroadcast(e.target.value)}
            placeholder="e.g. Weekend Special! Book any haircut before Friday and receive a complimentary Hot Towel Scalp Detox..."
            className="w-full p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500 font-mono"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-stone-400">Targeting {clients.filter(c => c.marketingConsent).length} opted-in shop clients</span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send WhatsApp Blast</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
