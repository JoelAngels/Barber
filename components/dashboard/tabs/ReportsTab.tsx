'use client';

import React from 'react';
import {BarChart3} from 'lucide-react';

export const ReportsTab: React.FC = () => {
    const totalWeeklyRevenue = 5840;
  const totalMonthlyRevenue = 24600;
  const retentionRate = 84; // %

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Shop Financial Reports & Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">Key performance metrics, revenue growth, customer retention, and top services.</p>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <span className="text-slate-500 dark:text-stone-400 text-xs font-semibold block">Monthly Total Revenue</span>
          <p className="text-3xl font-serif font-bold text-blue-600 dark:text-blue-400 mt-1">${totalMonthlyRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 inline-block">↑ +22% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <span className="text-slate-500 dark:text-stone-400 text-xs font-semibold block">Weekly Revenue</span>
          <p className="text-3xl font-serif font-bold text-slate-900 dark:text-stone-100 mt-1">${totalWeeklyRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 inline-block">↑ +14% growth</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <span className="text-slate-500 dark:text-stone-400 text-xs font-semibold block">Client Retention Rate</span>
          <p className="text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">{retentionRate}%</p>
          <span className="text-[10px] text-slate-500 dark:text-stone-400 mt-2 inline-block">8 out of 10 clients re-book within 30 days</span>
        </div>
      </div>

      {/* VISUAL CHARTS SIMULATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue Trends Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-base">Weekly Revenue Trend</h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">$5.8k total</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-200 dark:border-zinc-800">
            {[
              { day: 'Mon', amount: 620, height: '40%' },
              { day: 'Tue', amount: 780, height: '55%' },
              { day: 'Wed', amount: 950, height: '70%' },
              { day: 'Thu', amount: 1100, height: '80%' },
              { day: 'Fri', amount: 1450, height: '95%' },
              { day: 'Sat', amount: 1600, height: '100%' },
              { day: 'Sun', amount: 540, height: '35%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">${bar.amount}</span>
                <div
                  className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all group-hover:brightness-125"
                  style={{ height: bar.height }}
                />
                <span className="text-[10px] text-slate-500 dark:text-stone-400 font-bold">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Top Services Revenue Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-base">Top Performing Services</h3>

          <div className="space-y-3">
            {[
              { name: 'Signature Haircut & Beard Sculpt', percentage: 42, revenue: '$10,332' },
              { name: 'Precision Skin Fade & Taper', percentage: 28, revenue: '$6,888' },
              { name: 'Classic Gentlemen Cut', percentage: 18, revenue: '$4,428' },
              { name: 'Artisanal Beard Trim', percentage: 12, revenue: '$2,952' },
            ].map((srv, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-stone-200">{srv.name}</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{srv.revenue} ({srv.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-zinc-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-800">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${srv.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
