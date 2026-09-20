'use client';

import React, { useState } from 'react';
import {useApp} from '../../context/AppContext';
import {Modal} from './Modal';
import {Users, Calendar, CheckCircle2, User, Phone, Mail, ArrowRight, Tv, CalendarCheck} from 'lucide-react';

export const NewBookingModal: React.FC = () => {
  const { 
    quickWalkInModalOpen, 
    setQuickWalkInModalOpen,
    quickAppointmentModalOpen,
    setQuickAppointmentModalOpen,
    addWalkIn,
    addAppointment,
    services,
    barbers,
    walkIns,
    showToast,
    setActiveView,
    setDashboardTab,
    setTvModeOpen
  } = useApp();

  const isOpen = quickWalkInModalOpen || quickAppointmentModalOpen;
  const handleClose = () => {
    setQuickWalkInModalOpen(false);
    setQuickAppointmentModalOpen(false);
    setSuccessState(null);
  };

  const [bookingMode, setBookingMode] = useState<'walkin' | 'appointment'>('walkin');

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [barberId, setBarberId] = useState('any');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  // Success state for displaying generated ticket/code
  const [successState, setSuccessState] = useState<{
    type: 'walkin' | 'appointment';
    code: string;
    customerName: string;
    serviceName: string;
    barberName: string;
    timeOrWait: string;
  } | null>(null);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Name Required', 'Please enter customer name', 'error');
      return;
    }
    if (!customerPhone.trim()) {
      showToast('Phone Required', 'Please enter a contact phone number', 'error');
      return;
    }

    const selectedService = services.find(s => s.id === serviceId) || services[0];
    const selectedBarber = barbers.find(b => b.id === barberId);
    const barberDisplayName = selectedBarber ? selectedBarber.name : 'Any Available Barber';

    if (bookingMode === 'walkin') {
      const waitingCount = walkIns.filter(w => w.status === 'waiting').length;
      const estimatedWait = (waitingCount + 1) * 15;

      const created = addWalkIn({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        serviceId: selectedService.id,
        preferredBarberId: barberId,
        estimatedWaitMinutes: estimatedWait,
        status: 'waiting',
        notes: notes.trim(),
      });

      setSuccessState({
        type: 'walkin',
        code: `#${created.ticketNumber}`,
        customerName: created.customerName,
        serviceName: selectedService.name,
        barberName: barberDisplayName,
        timeOrWait: `~${estimatedWait} min wait`,
      });
    } else {
      const chosenBarberId = selectedBarber ? selectedBarber.id : barbers[0].id;
      const created = addAppointment({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        serviceId: selectedService.id,
        barberId: chosenBarberId,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: selectedService.durationMinutes,
        price: selectedService.price,
        depositAmount: 0,
        status: 'confirmed',
        notes: notes.trim(),
      });

      setSuccessState({
        type: 'appointment',
        code: created.bookingCode,
        customerName: created.customerName,
        serviceName: selectedService.name,
        barberName: barbers.find(b => b.id === chosenBarberId)?.name || 'Barber',
        timeOrWait: `${selectedDate} at ${selectedTime}`,
      });
    }

    // Reset fields for next entry
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNotes('');
  };

  const selectedServiceObj = services.find(s => s.id === serviceId) || services[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={successState ? 'Booking Confirmed!' : 'Create New Booking'}
      subtitle={
        successState 
          ? 'Ticket and client confirmation details are stored in live system.' 
          : 'Check-in a walk-in guest to the live queue or schedule a confirmed slot.'
      }
    >
      {successState ? (
        <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-stone-400">
              {successState.type === 'walkin' ? 'Live Queue Ticket Issued' : 'Appointment Confirmed'}
            </span>
            <div className="text-3xl font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {successState.code}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-stone-400">Customer:</span>
              <span className="font-bold text-slate-900 dark:text-stone-100">{successState.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-stone-400">Service:</span>
              <span className="font-bold text-slate-900 dark:text-stone-100">{successState.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-stone-400">Barber:</span>
              <span className="font-bold text-slate-900 dark:text-stone-100">{successState.barberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-stone-400">
                {successState.type === 'walkin' ? 'Estimated Wait:' : 'Schedule:'}
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{successState.timeOrWait}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {successState.type === 'walkin' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('dashboard');
                    setDashboardTab('walkins');
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>View in Queue Board</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setTvModeOpen(true);
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-stone-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Tv className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Open Lobby TV</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('dashboard');
                    setDashboardTab('calendar');
                  }}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View in Calendar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveView('dashboard');
                    setDashboardTab('overview');
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-stone-200 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSuccessState(null)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              + Create another booking
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BOOKING MODE SELECTOR TABS */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setBookingMode('walkin')}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                bookingMode === 'walkin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Walk-in Queue</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingMode('appointment')}
              className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                bookingMode === 'appointment'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-stone-400 hover:text-slate-900 dark:hover:text-stone-100'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Schedule Slot</span>
            </button>
          </div>

          {/* CUSTOMER CONTACT FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Customer Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Julian Hayes"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Mobile Phone (SMS) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 019-2849"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {bookingMode === 'appointment' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="julian@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* SERVICE & BARBER SELECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Barbershop Service
              </label>
              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ${s.price} ({s.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Preferred Barber
              </label>
              <select
                value={barberId}
                onChange={e => setBarberId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
              >
                <option value="any">Any Available Barber</option>
                {barbers.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.specialty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DATE & TIME (ONLY IN APPOINTMENT MODE) */}
          {bookingMode === 'appointment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-stone-400 mb-1">
                  Time Slot
                </label>
                <select
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:border-blue-500"
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* NOTES FIELD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
              Haircut / Style Request Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Skin fade with razor sharp-up"
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {bookingMode === 'walkin' ? (
              <>
                <Users className="w-4 h-4" />
                <span>Check-in to Queue & Issue Ticket</span>
              </>
            ) : (
              <>
                <CalendarCheck className="w-4 h-4" />
                <span>Confirm & Lock In Appointment (${selectedServiceObj?.price})</span>
              </>
            )}
          </button>

          {/* QUICK LINK TO FULL CUSTOMER BOOKING EXPERIENCE */}
          <div className="pt-2 text-center border-t border-slate-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                handleClose();
                setActiveView('booking');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Or launch full 5-step customer booking portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
