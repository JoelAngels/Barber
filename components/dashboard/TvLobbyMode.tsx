'use client';

import React from 'react';
import {useApp} from '../../context/AppContext';
import {BRAND_CONFIG} from '../../config/brand';
import {X, Clock, Scissors, Sparkles} from 'lucide-react';

export const TvLobbyMode: React.FC = () => {
  const { walkIns, setTvModeOpen, tvModeOpen } = useApp();

  if (!tvModeOpen) return null;

  const waitingList = walkIns.filter(w => w.status === 'waiting');
  const inChairList = walkIns.filter(w => w.status === 'in-chair');

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 p-8 flex flex-col justify-between animate-in zoom-in-95 duration-300 select-none">
      
      {/* TV Header */}
      <div className="flex items-center justify-between pb-6 border-b-2 border-blue-500/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-blue-600/30">
            <Scissors className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-extrabold text-stone-100 tracking-tight">{BRAND_CONFIG.sampleShop.name}</h1>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-0.5">Live Barber Queue Monitor • Please Have a Seat</p>
          </div>
        </div>

        <button
          onClick={() => setTvModeOpen(false)}
          className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-stone-400 hover:text-stone-100 transition-colors border border-zinc-800"
          title="Exit TV Mode"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* TV Queue Grid */}
      <div className="grid grid-cols-2 gap-8 my-8 flex-1">
        
        {/* Left Col: IN CHAIR NOW */}
        <div className="p-8 rounded-3xl bg-zinc-900/90 border-2 border-blue-500/60 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-extrabold uppercase tracking-wider mb-6 shadow-md shadow-blue-600/20">
              <Scissors className="w-4 h-4" />
              <span>In Chair Now</span>
            </div>

            <div className="space-y-4">
              {inChairList.length === 0 ? (
                <p className="text-stone-500 text-lg italic py-8">Chairs available. Next ticket will be called immediately.</p>
              ) : (
                inChairList.map(item => (
                  <div key={item.id} className="p-6 rounded-2xl bg-zinc-950 border border-blue-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-mono font-extrabold text-blue-400 block">{item.ticketNumber}</span>
                      <h3 className="text-xl font-bold text-stone-100 mt-1">{item.customerName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30 inline-block">
                        Chair Active
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-xs text-stone-400 mt-4">When your ticket appears on screen, please proceed to your assigned barber.</p>
        </div>

        {/* Right Col: UP NEXT IN QUEUE */}
        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-800 text-stone-200 text-sm font-bold uppercase tracking-wider mb-6">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Waiting List ({waitingList.length})</span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {waitingList.length === 0 ? (
                <p className="text-stone-500 text-lg italic py-8">No waiting queue. Step up to join walk-in!</p>
              ) : (
                waitingList.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center border border-blue-500/20">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="text-xl font-mono font-bold text-stone-100">{item.ticketNumber}</span>
                        <p className="text-xs text-stone-400">{item.customerName}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-semibold text-blue-400">
                      ~{(idx + 1) * 15} mins wait
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 mt-4">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Scan QR at front entrance to join live walk-in queue from your phone!</span>
          </div>
        </div>

      </div>

      {/* TV Footer */}
      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-stone-500">
        <span>Powered by Trimly Barber OS</span>
        <span>Wifi: Gentlemen_Guest | Pass: freshfade2026</span>
      </div>

    </div>
  );
};
