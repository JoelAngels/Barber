'use client';

import React, { useState } from 'react';
import {useApp} from '../../../context/AppContext';
import {Avatar} from '../../common/Avatar';
import {Calendar as CalendarIcon, Clock, Filter, Plus} from 'lucide-react';

export const CalendarTab: React.FC = () => {
  const { appointments, barbers, updateAppointmentStatus, setQuickAppointmentModalOpen, clients } = useApp();
  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const filteredBarbers = selectedBarberFilter === 'all' 
    ? barbers 
    : barbers.filter(b => b.id === selectedBarberFilter);

  return (
    <div className="space-y-6">
      
      {/* CALENDAR CONTROLS BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
            <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-950 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <select
              value={selectedBarberFilter}
              onChange={e => setSelectedBarberFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="all">All Barber Chairs Side-by-Side</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-stone-100">{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setQuickAppointmentModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book Slot</span>
        </button>
      </div>

      {/* TIMELINE GRID */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 overflow-x-auto shadow-sm">
        <div className="min-w-[700px]">
          
          {/* Header row: Barbers */}
          <div className="grid grid-cols-12 gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800 text-center font-serif font-bold text-slate-900 dark:text-stone-200">
            <div className="col-span-2 text-left text-xs text-slate-500 dark:text-stone-400 uppercase">Time Slot</div>
            <div className="col-span-10 grid grid-cols-3 gap-2">
              {filteredBarbers.map(barber => (
                <div key={barber.id} className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-center gap-2">
                  <Avatar name={barber.name} src={barber.avatar} size={24} ring="ring-blue-500/40" />
                  <span className="text-xs truncate">{barber.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time rows */}
          <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 mt-2">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-12 gap-2 py-3 items-center min-h-[64px]">
                <div className="col-span-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-stone-500" />
                  <span>{hour}</span>
                </div>

                <div className="col-span-10 grid grid-cols-3 gap-2">
                  {filteredBarbers.map(barber => {
                    const apt = appointments.find(a => a.barberId === barber.id && a.time.startsWith(hour.substring(0, 2)));

                    return (
                      <div key={barber.id} className="h-full">
                        {apt ? (
                          <div className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                            apt.status === 'completed'
                              ? 'bg-slate-100 dark:bg-zinc-950/80 border-blue-500/30 text-slate-700 dark:text-stone-300'
                              : apt.status === 'in-chair'
                              ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 text-blue-900 dark:text-stone-100 font-bold shadow-sm'
                              : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-stone-200 shadow-xs'
                          }`}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="flex min-w-0 items-center gap-1.5">
                                <Avatar
                                  name={apt.customerName}
                                  src={clients.find(c => c.name === apt.customerName)?.avatar}
                                  size={20}
                                />
                                <span className="truncate font-bold text-slate-900 dark:text-stone-100">{apt.customerName}</span>
                              </span>
                              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">${apt.price}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-stone-400 mt-1 truncate">{apt.notes || 'Cut & Style'}</span>
                            
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] uppercase font-bold text-blue-600 dark:text-blue-400">{apt.status}</span>
                              {apt.status === 'confirmed' && (
                                <button
                                  onClick={() => updateAppointmentStatus(apt.id, 'in-chair')}
                                  className="text-[9px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded shadow-xs"
                                >
                                  Seat
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setQuickAppointmentModalOpen(true)}
                            className="w-full h-full min-h-[48px] rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-zinc-800/40 text-[10px] text-slate-400 dark:text-stone-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center font-medium"
                          >
                            + Book {hour}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
