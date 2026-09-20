'use client';

import React from 'react';
import {useApp} from '../../../context/AppContext';
import {Avatar} from '../../common/Avatar';
import {Plus, ChevronRight, Scissors, Tv} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { 
    appointments, 
    walkIns, 
    barbers, 
    services, 
    clients, 
    updateAppointmentStatus, 
    updateWalkInStatus, 
    setQuickWalkInModalOpen,
    setDashboardTab,
    setTvModeOpen
  } = useApp();

  const todayAppointments = appointments;
  const totalRev = todayAppointments.reduce((acc, a) => acc + a.price, 0);
  const waitingWalkIns = walkIns.filter(w => w.status === 'waiting');

  return (
    <div className="space-y-8">
      
      {/* 3-COLUMN EDITORIAL DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN 1: LIVE QUEUE & EXPECTED REVENUE CARD (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* LIVE QUEUE SECTION */}
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block">Live Lobby</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100">Walk-in Queue</h3>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                LIVE QUEUE
              </span>
            </div>

            {waitingWalkIns.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-white/40 bg-slate-50 dark:bg-[#262626] rounded-2xl">
                No walk-in clients waiting right now.
              </div>
            ) : (
              <div className="space-y-3">
                {waitingWalkIns.slice(0, 3).map(walkIn => (
                  <div
                    key={walkIn.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#262626] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-mono font-bold text-[10px]">
                          #{walkIn.ticketNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                          ~{walkIn.estimatedWaitMinutes} MIN WAIT
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-stone-100 text-sm mt-1">{walkIn.customerName}</h4>
                      <p className="text-xs text-slate-600 dark:text-white/60">{walkIn.notes || 'Gentleman Cut'}</p>
                    </div>

                    <button
                      onClick={() => updateWalkInStatus(walkIn.id, 'in-chair')}
                      className="shrink-0 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all"
                    >
                      Seat Chair
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => setQuickWalkInModalOpen(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Ticket</span>
              </button>
              <button
                onClick={() => setTvModeOpen(true)}
                className="text-xs font-semibold text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Lobby TV View</span>
              </button>
            </div>
          </div>

          {/* EDITORIAL REVENUE HIGHLIGHT CARD */}
          <div className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl shadow-blue-600/20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100 block">
              EXPECTED REVENUE TODAY
            </span>
            <div className="text-4xl font-extrabold tracking-tight italic font-serif text-white">
              ${totalRev.toFixed(2)}
            </div>
            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold">
              <span>+18% vs Last Wednesday</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-950 text-white text-[10px]">98% Show Rate</span>
            </div>
          </div>

        </div>

        {/* COLUMN 2: TIMELINE APPOINTMENTS SCHEDULE (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block">Daily Timeline</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100">Schedule</h3>
              </div>
              <button
                onClick={() => setDashboardTab('calendar')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {todayAppointments.map(apt => {
                const barber = barbers.find(b => b.id === apt.barberId);
                const service = services.find(sv => sv.id === apt.serviceId);
                // Walk-ups may not be in the CRM yet; Avatar falls back to initials.
                const customer = clients.find(c => c.name === apt.customerName);

                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#262626] flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 shrink-0 text-center">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">{apt.time}</span>
                        <span className="text-[10px] text-slate-500 dark:text-white/40 uppercase font-semibold tabular">{apt.durationMinutes} MIN</span>
                      </div>

                      <Avatar name={apt.customerName} src={customer?.avatar} size={36} />

                      <div className="border-l border-slate-200 dark:border-white/10 pl-4">
                        <h4 className="font-bold text-slate-900 dark:text-stone-100 text-sm">{apt.customerName}</h4>
                        <p className="text-xs text-slate-600 dark:text-white/60">
                          {barber?.name || 'Any Barber'} • {service?.name || 'Custom Cut'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-stone-100 block mb-1">${apt.price}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : apt.status === 'in-chair'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 animate-pulse'
                          : 'bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-white/70'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 3: STAFF CHAIR STATUS & SHOP CONCIERGE (col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* STAFF CHAIR OCCUPANCY */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 block mb-1">
              Team Availability
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-stone-100 mb-4">Chairs</h3>

            <div className="space-y-4">
              {barbers.map((barber, idx) => {
                const currentApt = appointments.find(a => a.barberId === barber.id && a.status === 'in-chair');

                return (
                  <div key={barber.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#262626]">
                    <div className="flex items-center gap-3">
                      <Avatar name={barber.name} src={barber.avatar} size={36} ring="ring-blue-500/40" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-stone-100 text-xs truncate">{barber.name}</h4>
                        <span className="text-[10px] text-slate-500 dark:text-white/50 block">
                          Chair #{idx + 1} • {barber.specialty}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-bold">
                      {currentApt ? (
                        <>
                          <span className="text-blue-600 dark:text-blue-400">IN CHAIR: {currentApt.customerName}</span>
                          <button
                            onClick={() => updateAppointmentStatus(currentApt.id, 'completed')}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Complete
                          </button>
                        </>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400">● READY FOR NEXT CUT</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SHOP CONCIERGE PROMO CARD */}
          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#1e1e1e] p-6 text-center space-y-3">
            <Scissors className="w-6 h-6 mx-auto text-blue-600" />
            <h4 className="font-bold text-slate-900 dark:text-stone-100 text-sm">Automated Concierge</h4>
            <p className="text-xs text-slate-600 dark:text-white/60 leading-relaxed">
              WhatsApp reminders & queue alerts are running smoothly today.
            </p>
            <button
              onClick={() => setDashboardTab('marketing')}
              className="w-full py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Marketing Hub →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
