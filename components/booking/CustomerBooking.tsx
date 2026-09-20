'use client';

import React, { useState } from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {useApp} from '../../context/AppContext';
import {Avatar} from '../common/Avatar';
import {BRAND_CONFIG} from '../../config/brand';
import {Service, Barber} from '../../types';
import {MapPin, Calendar, Clock, ArrowLeft, Star, Sparkles, CheckCircle2, QrCode, MessageSquare, CalendarPlus, Users} from 'lucide-react';

export const CustomerBooking: React.FC = () => {
  const { 
    services, 
    barbers, 
    addAppointment, 
    addWalkIn, 
    walkIns, 
    showToast,
    setSelectedLocationId,
    selectedLocationId,
    setActiveView
  } = useApp();

  // Booking Flow State
  const [bookingType, setBookingType] = useState<'appointment' | 'walkin'>('appointment');
  const [step, setStep] = useState<number>(1); // 1: location, 2: service, 3: barber, 4: date/time, 5: details, 6: payment/deposit, 7: confirmation

  // Selected Booking Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  
  // Customer Info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [payDeposit, setPayDeposit] = useState<boolean>(true);

  // Confirmed Result State
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string>('');
  const [confirmedWalkInTicket, setConfirmedWalkInTicket] = useState<string>('');

  const currentLocation = BRAND_CONFIG.locations.find(l => l.id === selectedLocationId) || BRAND_CONFIG.locations[0];

  // Helper time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Date options for next 7 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const datesList = getDates();

  // Handle final appointment confirmation
  const handleConfirmAppointment = () => {
    if (!selectedService) return;

    const chosenBarberId = selectedBarber ? selectedBarber.id : barbers[0].id;
    const depositAmt = payDeposit ? 10 : 0;

    const newApt = addAppointment({
      customerName: customerName || 'Valued Client',
      customerPhone: customerPhone || '+1 (555) 019-2834',
      customerEmail: customerEmail || 'client@example.com',
      serviceId: selectedService.id,
      barberId: chosenBarberId,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      depositAmount: depositAmt,
      status: 'confirmed',
      notes: customerNotes,
    });

    setConfirmedBookingCode(newApt.bookingCode);
    setStep(7); // Jump to confirmation screen
  };

  // Handle Walk-in Queue Join
  const handleConfirmWalkIn = () => {
    if (!selectedService) return;

    const waitingCount = walkIns.filter(w => w.status === 'waiting').length;
    const estimatedWait = (waitingCount + 1) * 15;

    const newWalkIn = addWalkIn({
      customerName: customerName || 'Walk-in Client',
      customerPhone: customerPhone || '+1 (555) 019-9988',
      serviceId: selectedService.id,
      preferredBarberId: selectedBarber ? selectedBarber.id : 'any',
      estimatedWaitMinutes: estimatedWait,
      status: 'waiting',
      notes: customerNotes,
    });

    setConfirmedWalkInTicket(newWalkIn.ticketNumber);
    setStep(7);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#121212] text-[#1A1A1A] dark:text-stone-100 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* SHOP HEADER BRAND CARD */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Barber Booking</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-serif">{BRAND_CONFIG.sampleShop.name}</h1>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{currentLocation.address}</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-right border-t sm:border-t-0 border-slate-200 dark:border-white/10 pt-4 sm:pt-0">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{currentLocation.rating}</span>
              <span className="text-slate-400 dark:text-white/40 font-normal text-xs">(384 reviews)</span>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mt-1">Open Today • 8AM - 8PM</span>
          </div>
        </div>

        {/* MODE TOGGLE: Book Appointment vs Join Walk-in Queue */}
        <div className="grid grid-cols-2 gap-2 bg-white dark:bg-[#1A1A1A] p-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm mb-8">
          <button
            onClick={() => {
              setBookingType('appointment');
              setStep(1);
            }}
            className={`py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              bookingType === 'appointment'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          <button
            onClick={() => {
              setBookingType('walkin');
              setStep(1);
            }}
            className={`py-3 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              bookingType === 'walkin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Join Walk-in Queue</span>
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        {step < 7 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/60 font-bold uppercase tracking-wider mb-2">
              <span>Step {step} of {bookingType === 'appointment' ? 6 : 4}</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {step === 1 && 'Select Branch'}
                {step === 2 && 'Choose Service'}
                {step === 3 && 'Choose Barber'}
                {step === 4 && (bookingType === 'appointment' ? 'Select Date & Time' : 'Your Details')}
                {step === 5 && 'Customer Details'}
                {step === 6 && 'Review & Deposit'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(step / (bookingType === 'appointment' ? 6 : 4)) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${bookingType}-${step}`}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 1: SELECT LOCATION */}
            {step === 1 && (
              <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100 mb-4">Choose Barbershop Branch</h2>
            {BRAND_CONFIG.locations.map(loc => (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLocationId(loc.id);
                  setStep(2);
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  selectedLocationId === loc.id
                    ? 'bg-white dark:bg-[#1A1A1A] border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-white dark:bg-[#1A1A1A] border-black/5 dark:border-white/10 hover:border-blue-500/50 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] dark:text-stone-100 text-base">{loc.name}</h3>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-1">{loc.address}</p>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">{loc.phone}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white inline-block shadow-md shadow-blue-600/20">
                    Select Branch
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: CHOOSE SERVICE */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to locations
              </button>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">Select Service</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {services.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => {
                    setSelectedService(srv);
                    setStep(3);
                  }}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    selectedService?.id === srv.id
                      ? 'bg-white dark:bg-[#1A1A1A] border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-white dark:bg-[#1A1A1A] border-black/5 dark:border-white/10 hover:border-blue-500/50 shadow-sm'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400">
                        {srv.category}
                      </span>
                      {srv.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                          🔥 Most Popular
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] dark:text-stone-100 text-base">{srv.name}</h3>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-1">{srv.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-black/70 dark:text-white/70 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {srv.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 block mb-2">${srv.price}</span>
                    <button className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE BARBER */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to services
              </button>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">Select Barber</h2>
            </div>

            {/* Any Barber Option */}
            <div
              onClick={() => {
                setSelectedBarber(null);
                setStep(4);
              }}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedBarber === null
                  ? 'bg-white dark:bg-[#1A1A1A] border-blue-500 shadow-lg'
                  : 'bg-white dark:bg-[#1A1A1A] border-black/5 dark:border-white/10 hover:border-blue-500/50 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] dark:text-stone-100 text-base">Any Available Barber</h3>
                  <p className="text-xs text-black/60 dark:text-white/60 mt-0.5">Fastest appointment time with any master craftsman</p>
                </div>
              </div>
              <span className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider">Select</span>
            </div>

            {/* Individual Barbers */}
            <div className="grid grid-cols-1 gap-3">
              {barbers.filter(b => b.isAvailable).map(barber => (
                <div
                  key={barber.id}
                  onClick={() => {
                    setSelectedBarber(barber);
                    setStep(4);
                  }}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    selectedBarber?.id === barber.id
                      ? 'bg-white dark:bg-[#1A1A1A] border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-white dark:bg-[#1A1A1A] border-black/5 dark:border-white/10 hover:border-blue-500/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={barber.name} src={barber.avatar} size={56} ring="ring-blue-500/40" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#1A1A1A] dark:text-stone-100 text-base">{barber.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
                          <span>{barber.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-black/70 dark:text-white/70 mt-0.5 font-medium">{barber.title}</p>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-1">{barber.specialty}</p>
                    </div>
                  </div>

                  <button className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold uppercase tracking-wider shrink-0">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 (APPOINTMENT): DATE & TIME SELECTOR */}
        {step === 4 && bookingType === 'appointment' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back to barbers
              </button>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">Select Date & Time</h2>
            </div>

            {/* Date Carousel */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
                Select Date
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {datesList.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d.fullDate)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedDate === d.fullDate
                        ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-lg shadow-blue-600/20 scale-105'
                        : 'bg-white dark:bg-[#1A1A1A] border-black/5 dark:border-white/10 text-[#1A1A1A] dark:text-stone-300 hover:border-blue-500/50'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold">{d.dayName}</span>
                    <span className="block text-lg font-bold my-0.5">{d.dayNum}</span>
                    <span className="block text-[10px] uppercase font-bold">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {timeSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-3 rounded-2xl border text-xs font-bold transition-all ${
                      selectedTime === slot
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                        : 'bg-white dark:bg-[#1A1A1A] border-black/5 dark:border-white/10 text-[#1A1A1A] dark:text-stone-300 hover:border-blue-500/50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(5)}
              className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all"
            >
              Continue to Details →
            </button>
          </div>
        )}

        {/* STEP 4 (WALK-IN) OR STEP 5 (APPOINTMENT): CUSTOMER DETAILS */}
        {((step === 4 && bookingType === 'walkin') || (step === 5 && bookingType === 'appointment')) && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(bookingType === 'appointment' ? 4 : 3)}
                className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">Your Contact Details</h2>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Alexander Hayes"
                  className="w-full px-4 py-3 bg-[#FDFCFB] dark:bg-[#262626] border border-black/10 dark:border-white/10 rounded-xl text-sm text-[#1A1A1A] dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Mobile Phone Number (SMS alerts) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-4 py-3 bg-[#FDFCFB] dark:bg-[#262626] border border-black/10 dark:border-white/10 rounded-xl text-sm text-[#1A1A1A] dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              {bookingType === 'appointment' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="alex.hayes@example.com"
                    className="w-full px-4 py-3 bg-[#FDFCFB] dark:bg-[#262626] border border-black/10 dark:border-white/10 rounded-xl text-sm text-[#1A1A1A] dark:text-stone-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1">Haircut / Style Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Skin fade with razor sharp-up"
                  className="w-full px-4 py-3 bg-[#FDFCFB] dark:bg-[#262626] border border-black/10 dark:border-white/10 rounded-xl text-sm text-[#1A1A1A] dark:text-stone-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!customerName || !customerPhone) {
                  showToast('Required Information', 'Please enter your name and phone number', 'error');
                  return;
                }
                if (bookingType === 'appointment') setStep(6);
                else handleConfirmWalkIn();
              }}
              className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all"
            >
              {bookingType === 'appointment' ? 'Review & Deposit →' : 'Join Walk-in Queue Now →'}
            </button>
          </div>
        )}

        {/* STEP 6 (APPOINTMENT ONLY): REVIEW & DEPOSIT */}
        {step === 6 && bookingType === 'appointment' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(5)}
                className="text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100">Review Booking Summary</h2>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#1A1A1A] border border-black/5 dark:border-white/10 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/10">
                <div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">{selectedService?.category}</span>
                  <h3 className="font-bold text-xl text-[#1A1A1A] dark:text-stone-100 mt-1">{selectedService?.name}</h3>
                </div>
                <span className="text-3xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">${selectedService?.price}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-black/50 dark:text-white/50 block font-bold uppercase tracking-wider">Date & Time</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-stone-100 text-sm mt-0.5 block">{selectedDate} @ {selectedTime}</span>
                </div>
                <div>
                  <span className="text-black/50 dark:text-white/50 block font-bold uppercase tracking-wider">Assigned Barber</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-stone-100 text-sm mt-0.5 block">
                    {selectedBarber ? selectedBarber.name : 'Any Available Barber'}
                  </span>
                </div>
                <div>
                  <span className="text-black/50 dark:text-white/50 block font-bold uppercase tracking-wider">Client Name</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-stone-100 text-sm mt-0.5 block">{customerName}</span>
                </div>
                <div>
                  <span className="text-black/50 dark:text-white/50 block font-bold uppercase tracking-wider">Phone</span>
                  <span className="font-bold text-[#1A1A1A] dark:text-stone-100 text-sm mt-0.5 block">{customerPhone}</span>
                </div>
              </div>

              {/* Deposit Option */}
              <div className="pt-4 border-t border-black/5 dark:border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-2">Payment Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayDeposit(true)}
                    className={`p-4 rounded-2xl border text-left text-xs transition-all ${
                      payDeposit
                        ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-black/60 dark:text-white/60'
                    }`}
                  >
                    <span className="block font-bold">Pay $10 Deposit Now</span>
                    <span className="text-[10px] opacity-75 font-normal">Guarantees seat & reduces wait</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayDeposit(false)}
                    className={`p-4 rounded-2xl border text-left text-xs transition-all ${
                      !payDeposit
                        ? 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-black/60 dark:text-white/60'
                    }`}
                  >
                    <span className="block font-bold">Pay Full in Shop</span>
                    <span className="text-[10px] opacity-75 font-normal">Pay cash/card after cut</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmAppointment}
              className="w-full py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm & Lock In Booking</span>
            </button>
          </div>
        )}

        {/* STEP 7: CONFIRMATION SCREEN & ACTION CARDS */}
        {step === 7 && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A] dark:text-stone-100 font-serif">
                {bookingType === 'appointment' ? 'Booking Confirmed!' : 'You’re in the Walk-in Queue!'}
              </h2>
              <p className="text-black/60 dark:text-white/60 text-sm mt-2">
                {bookingType === 'appointment'
                  ? `We look forward to seeing you, ${customerName}!`
                  : `Your ticket has been added to our live shop queue monitor.`}
              </p>
            </div>

            {/* Confirmation Ticket Card */}
            <div className="p-8 rounded-3xl bg-[#1A1A1A] text-white text-left max-w-md mx-auto shadow-2xl relative overflow-hidden border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold block">
                    {bookingType === 'appointment' ? 'Booking Reference' : 'Live Queue Ticket'}
                  </span>
                  <p className="text-3xl font-mono font-extrabold text-blue-400 mt-1">
                    {bookingType === 'appointment' ? confirmedBookingCode : confirmedWalkInTicket}
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                  <QrCode className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="mt-6 space-y-2.5 text-xs text-white/80">
                <div className="flex justify-between">
                  <span className="text-white/50">Barbershop:</span>
                  <span className="font-bold text-white">{BRAND_CONFIG.sampleShop.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Service:</span>
                  <span className="font-bold text-white">{selectedService?.name} (${selectedService?.price})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Barber:</span>
                  <span className="font-bold text-white">{selectedBarber ? selectedBarber.name : 'Any Available'}</span>
                </div>
                {bookingType === 'appointment' && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Time:</span>
                    <span className="font-bold text-white">{selectedDate} @ {selectedTime}</span>
                  </div>
                )}
                {bookingType === 'walkin' && (
                  <div className="flex justify-between">
                    <span className="text-white/50">Est. Waiting Time:</span>
                    <span className="font-bold text-blue-400">~20 minutes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post-Booking Actions: WhatsApp, Add to Calendar & Dashboard View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hi ${customerName}! Your appointment at ${BRAND_CONFIG.sampleShop.name} is confirmed. Ref: ${confirmedBookingCode}`
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => showToast('WhatsApp Notice', 'WhatsApp confirmation text generated!', 'info')}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Alert</span>
              </a>

              <button
                onClick={() => showToast('Calendar Event', 'Added to Calendar schedule!', 'success')}
                className="py-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-zinc-800 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                <CalendarPlus className="w-4 h-4 text-blue-400" />
                <span>Add to Calendar</span>
              </button>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>View on Shop Dashboard →</span>
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setSelectedBarber(null);
                  setConfirmedBookingCode('');
                  setConfirmedWalkInTicket('');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold uppercase tracking-wider"
              >
                ← Book another haircut
              </button>
            </div>

          </div>
        )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};
