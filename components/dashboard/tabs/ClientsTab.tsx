'use client';

import React, { useState } from 'react';
import {useApp} from '../../../context/AppContext';
import {Client} from '../../../types';
import {Avatar} from '../../common/Avatar';
import {Users, Search, Phone, Mail, Edit, Save, Scissors, UserPlus} from 'lucide-react';
import {Modal} from '../../common/Modal';

export const ClientsTab: React.FC = () => {
  const { clients, barbers, updateClientNotes, addClient, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [editNotes, setEditNotes] = useState(selectedClient ? selectedClient.formulaNotes : '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Add Client Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newBarberId, setNewBarberId] = useState(barbers[0]?.id || 'b1');

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleSaveNotes = () => {
    if (selectedClient) {
      updateClientNotes(selectedClient.id, editNotes);
      setSelectedClient({ ...selectedClient, formulaNotes: editNotes });
      setIsEditingNotes(false);
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      showToast('Validation Error', 'Name and Phone number are required', 'error');
      return;
    }

    const created = addClient({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      preferredBarberId: newBarberId,
      formulaNotes: newNotes.trim() || 'Skin fade, textured top',
      marketingConsent: true,
      lastVisitDate: new Date().toISOString().split('T')[0],
    });

    setSelectedClient(created);
    setEditNotes(created.formulaNotes);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT: CLIENTS LIST & SEARCH */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Client CRM ({clients.length})</span>
          </h2>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            title="Add New Client"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Client</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Client Cards List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => {
                setSelectedClient(client);
                setEditNotes(client.formulaNotes);
                setIsEditingNotes(false);
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                selectedClient?.id === client.id
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 text-slate-900 dark:text-stone-100 shadow-xs'
                  : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={client.name}
                  src={client.avatar}
                  size={40}
                  ring="ring-blue-500/25"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-stone-100 text-xs">{client.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-stone-400 mt-0.5">{client.phone}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 block">
                  {client.loyaltyTier}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-stone-400 mt-0.5 block">{client.totalVisits} Cuts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: CLIENT PROFILE & HAIRCUT FORMULA NOTES */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-6 shadow-sm">
        {selectedClient ? (
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-slate-200 dark:border-zinc-800 gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  name={selectedClient.name}
                  src={selectedClient.avatar}
                  size={64}
                  ring="ring-blue-500/30"
                  className="shadow-lg shadow-blue-600/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-stone-100">{selectedClient.name}</h3>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                      {selectedClient.loyaltyTier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-stone-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {selectedClient.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {selectedClient.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="text-xs text-slate-500 dark:text-stone-400 block">Total Spent</span>
                  <span className="text-xl font-serif font-bold text-blue-600 dark:text-blue-400">${selectedClient.totalSpent}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-stone-400 block">Loyalty Points</span>
                  <span className="text-xl font-serif font-bold text-blue-600 dark:text-blue-400">{selectedClient.loyaltyPoints} pts</span>
                </div>
              </div>
            </div>

            {/* Haircut Formula Notes Box */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-blue-200 dark:border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-serif font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  <span>Barber Haircut Formula & Style Notes</span>
                </h4>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Formula
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Formula
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-zinc-900 border border-blue-500/50 rounded-xl text-xs text-slate-900 dark:text-stone-100 font-mono focus:outline-none"
                />
              ) : (
                <p className="text-xs text-slate-800 dark:text-stone-300 font-mono bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 leading-relaxed">
                  {selectedClient.formulaNotes || 'No custom formula saved for this client yet.'}
                </p>
              )}
            </div>

            {/* Client Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase font-bold block">Preferred Barber</span>
                <span className="text-sm font-bold text-slate-900 dark:text-stone-100 mt-1 block">
                  {barbers.find(b => b.id === selectedClient.preferredBarberId)?.name || 'Marcus Vance'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase font-bold block">Total Visited Cuts</span>
                <span className="text-sm font-bold text-slate-900 dark:text-stone-100 mt-1 block">{selectedClient.totalVisits} Times</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <span className="text-[10px] text-slate-500 dark:text-stone-400 uppercase font-bold block">WhatsApp Consent</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 block">
                  {selectedClient.marketingConsent ? 'Active Consent' : 'Opted Out'}
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 dark:text-stone-500">
            Select a client from the list to view profile and haircut notes.
          </div>
        )}
      </div>

      {/* ADD CLIENT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client to CRM"
        subtitle="Record client contact details, preferred barber, and hair style notes."
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Liam Henderson"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Phone Number (WhatsApp/SMS) *
              </label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="+1 (555) 304-9182"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="liam@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
              Preferred Barber
            </label>
            <select
              value={newBarberId}
              onChange={e => setNewBarberId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500"
            >
              {barbers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.specialty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-1">
              Haircut Formula / Style Notes
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="e.g. Guard #1 taper fade, razor sharp-up on neck, matte clay finish"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-stone-100 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Save Client Profile</span>
          </button>
        </form>
      </Modal>

    </div>
  );
};
