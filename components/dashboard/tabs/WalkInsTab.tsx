'use client';

import React from 'react';
import {useApp} from '../../../context/AppContext';
import {Avatar} from '../../common/Avatar';
import {WalkInStatus} from '../../../types';
import {Users, Clock, Plus, CheckCircle2, Scissors, Tv} from 'lucide-react';

export const WalkInsTab: React.FC = () => {
  const { walkIns, updateWalkInStatus, setQuickWalkInModalOpen, setTvModeOpen, barbers, services, clients } = useApp();

  const columns: { status: WalkInStatus; label: string; color: string }[] = [
    { status: 'waiting', label: 'Waiting in Lobby', color: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' },
    { status: 'in-chair', label: 'Currently in Chair', color: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
    { status: 'completed', label: 'Completed Cut', color: 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' },
    { status: 'no-show', label: 'No Show / Left', color: 'border-slate-300 dark:border-zinc-700 text-slate-500 dark:text-stone-400 bg-slate-100 dark:bg-zinc-800' },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Walk-in Queue Board</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">Real-time status management for non-booked shop visitors.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTvModeOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-blue-600 dark:text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Tv className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Lobby TV View</span>
          </button>

          <button
            onClick={() => setQuickWalkInModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Walk-in Ticket</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(col => {
          const list = walkIns.filter(w => w.status === col.status);

          return (
            <div key={col.status} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col min-h-[500px] shadow-sm">
              
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-zinc-800">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${col.color}`}>
                  {col.label} ({list.length})
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {list.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-stone-500 text-xs italic">
                    No tickets in this column
                  </div>
                ) : (
                  list.map(ticket => {
                    const prefBarber = barbers.find(b => b.id === ticket.preferredBarberId);
                    const service = services.find(s => s.id === ticket.serviceId);

                    return (
                      <div
                        key={ticket.id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/40 transition-all space-y-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
                            #{ticket.ticketNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-stone-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Checked-in {ticket.checkInTime}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <Avatar
                            name={ticket.customerName}
                            src={clients.find(c => c.name === ticket.customerName)?.avatar}
                            size={36}
                            className="mt-0.5"
                          />
                          <div>
                          <h4 className="font-bold text-slate-900 dark:text-stone-100 text-sm">{ticket.customerName}</h4>
                          <p className="text-xs text-slate-700 dark:text-stone-300 font-medium">{service?.name || 'Haircut'}</p>
                          <p className="text-[10px] text-slate-500 dark:text-stone-400 mt-1">
                            Barber: <span className="text-blue-600 dark:text-blue-300 font-semibold">{prefBarber ? prefBarber.name : 'Any Available'}</span>
                          </p>
                          </div>
                        </div>

                        {ticket.notes && (
                          <p className="text-[10px] text-slate-600 dark:text-stone-400 bg-white dark:bg-zinc-900 p-2 rounded border border-slate-200 dark:border-zinc-800 italic">
                            “{ticket.notes}”
                          </p>
                        )}

                        {/* Status Change Buttons */}
                        <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/80 flex items-center gap-1.5 justify-end">
                          {ticket.status === 'waiting' && (
                            <button
                              onClick={() => updateWalkInStatus(ticket.id, 'in-chair')}
                              className="px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-500 transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Scissors className="w-3 h-3" /> Seat in Chair
                            </button>
                          )}

                          {ticket.status === 'in-chair' && (
                            <button
                              onClick={() => updateWalkInStatus(ticket.id, 'completed')}
                              className="px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-500 transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Complete
                            </button>
                          )}

                          {ticket.status !== 'no-show' && ticket.status !== 'completed' && (
                            <button
                              onClick={() => updateWalkInStatus(ticket.id, 'no-show')}
                              className="px-2 py-1 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-stone-400 hover:text-red-500 text-[10px] font-semibold transition-colors"
                            >
                              No Show
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
