'use client';

import React from 'react';
import {useApp} from '../../../context/AppContext';
import {Avatar} from '../../common/Avatar';
import {INITIAL_STAFF_PERFORMANCE} from '../../../data/mockData';
import {Users, Star} from 'lucide-react';

export const StaffTab: React.FC = () => {
  const { barbers } = useApp();

  return (
    <div className="space-y-6">
      
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Staff & Commission Performance</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">Track individual barber appointments, tip payouts, and split commission payouts.</p>
        </div>
      </div>

      {/* STAFF CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {barbers.map(barber => {
          const perf = INITIAL_STAFF_PERFORMANCE.find(p => p.barberId === barber.id) || {
            appointmentsCount: 8,
            servicesRevenue: 380,
            productSalesRevenue: 40,
            tipsEarned: 65,
            commissionEarned: 228,
            occupancyPercentage: 80,
            avgRating: 4.9,
          };

          return (
            <div key={barber.id} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/40 transition-all space-y-5 shadow-lg">
              
              {/* Barber Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={barber.name} src={barber.avatar} size={56} ring="ring-blue-500/50" />
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-stone-100">{barber.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-stone-400">{barber.title}</p>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 inline-block mt-1">
                      {barber.commissionRate}% Split Commission
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-zinc-950 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-800">
                  <Star className="w-3.5 h-3.5 fill-blue-400" />
                  <span>{barber.rating}</span>
                </div>
              </div>

              {/* Performance Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-stone-400 block text-[10px]">Cuts Today</span>
                  <span className="font-serif font-bold text-slate-900 dark:text-stone-100 text-lg mt-0.5 block">{perf.appointmentsCount}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-stone-400 block text-[10px]">Total Generated</span>
                  <span className="font-serif font-bold text-blue-600 dark:text-blue-400 text-lg mt-0.5 block">${perf.servicesRevenue}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-stone-400 block text-[10px]">Tips Earned</span>
                  <span className="font-serif font-bold text-emerald-600 dark:text-emerald-400 text-lg mt-0.5 block">${perf.tipsEarned}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-stone-400 block text-[10px]">Chair Occupancy</span>
                  <span className="font-serif font-bold text-slate-900 dark:text-stone-100 text-lg mt-0.5 block">{perf.occupancyPercentage}%</span>
                </div>
              </div>

              {/* Commission Calculation Box */}
              <div className="p-4 rounded-xl bg-linear-to-r from-blue-500/10 via-zinc-950 to-zinc-950 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase font-bold block">Barber Payout Today</span>
                  <span className="text-2xl font-serif font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    ${(perf.commissionEarned + perf.tipsEarned).toFixed(2)}
                  </span>
                </div>
                <div className="text-right text-[10px] text-slate-500 dark:text-stone-400 font-mono">
                  <span>${perf.commissionEarned} Cut Split</span> <br />
                  <span>+ ${perf.tipsEarned} Tips</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
