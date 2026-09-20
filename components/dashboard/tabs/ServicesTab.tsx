'use client';

import React, { useState } from 'react';
import {useApp} from '../../../context/AppContext';
import {Service, ServiceCategory} from '../../../types';
import {Modal} from '../../common/Modal';
import {Scissors, Plus, Clock, Edit} from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { services, addService, updateService } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Hair' as ServiceCategory,
    durationMinutes: 30,
    price: 35,
    description: '',
    popular: false,
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      name: '',
      category: 'Hair',
      durationMinutes: 30,
      price: 35,
      description: '',
      popular: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setForm({
      name: srv.name,
      category: srv.category,
      durationMinutes: srv.durationMinutes,
      price: srv.price,
      description: srv.description,
      popular: srv.popular || false,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService({
        ...editingService,
        ...form,
      });
    } else {
      addService(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Barbershop Service Menu ({services.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">Customize service names, prices, durations, and popular badges.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(srv => (
          <div key={srv.id} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-500/40 transition-all flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-50 dark:bg-zinc-950 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-zinc-800">
                  {srv.category}
                </span>
                {srv.popular && (
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    🔥 Popular
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-slate-900 dark:text-stone-100 text-base">{srv.name}</h3>
              <p className="text-xs text-slate-500 dark:text-stone-400 mt-1">{srv.description}</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-700 dark:text-stone-300">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> {srv.durationMinutes} mins
                </span>
                <span className="flex items-center gap-1 font-serif font-bold text-blue-600 dark:text-blue-400 text-sm">
                  ${srv.price}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(srv)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-stone-100 transition-colors shrink-0"
              title="Edit Service"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service Details' : 'Add New Barbershop Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Service Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Skin Fade & Beard Trim"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as ServiceCategory })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              >
                <option value="Hair">Hair</option>
                <option value="Beard">Beard</option>
                <option value="Combos & Packages">Combos & Packages</option>
                <option value="Treatments & Extras">Treatments & Extras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min={5}
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Duration (Minutes)</label>
            <input
              type="number"
              required
              min={10}
              step={5}
              value={form.durationMinutes}
              onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-stone-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Brief summary of what is included..."
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="popular"
              checked={form.popular}
              onChange={e => setForm({ ...form, popular: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded"
            />
            <label htmlFor="popular" className="text-xs text-slate-700 dark:text-stone-300 cursor-pointer">
              Mark as “Popular” badge on booking site
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
          >
            {editingService ? 'Save Changes' : 'Create Service'}
          </button>
        </form>
      </Modal>

    </div>
  );
};
