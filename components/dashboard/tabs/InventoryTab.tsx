'use client';

import React from 'react';
import {useApp} from '../../../context/AppContext';
import {ProductImage} from '../../common/ProductImage';
import {ShoppingBag, AlertTriangle, Plus, Minus, RefreshCw, DollarSign, Layers, TrendingUp} from 'lucide-react';

export const InventoryTab: React.FC = () => {
  const { products, updateProductStock, showToast } = useApp();

  // What the shelves are actually worth, and what they would return.
  const costValue = products.reduce((a, p) => a + p.costPrice * p.stockQuantity, 0);
  const retailValue = products.reduce((a, p) => a + p.price * p.stockQuantity, 0);
  const unitCount = products.reduce((a, p) => a + p.stockQuantity, 0);
  const lowStock = products.filter(p => p.stockQuantity <= p.reorderThreshold);
  const potentialMargin = retailValue > 0 ? Math.round(((retailValue - costValue) / retailValue) * 100) : 0;

  const SUMMARY = [
    { label: 'Stock at cost',    value: `$${costValue.toLocaleString()}`,   foot: `${unitCount} units on hand`,        Icon: DollarSign, tone: 'text-slate-900 dark:text-stone-100' },
    { label: 'Retail value',     value: `$${retailValue.toLocaleString()}`, foot: `${potentialMargin}% potential margin`, Icon: TrendingUp, tone: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Distinct SKUs',    value: String(products.length),            foot: 'Across all suppliers',              Icon: Layers,     tone: 'text-slate-900 dark:text-stone-100' },
    { label: 'Needs reordering', value: String(lowStock.length),            foot: lowStock.length ? lowStock.map(p => p.sku).join(', ') : 'All above threshold', Icon: AlertTriangle, tone: lowStock.length ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-stone-100' },
  ];

  return (
    <div className="space-y-6">
      
      <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-stone-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Retail Products & Supplies Inventory ({products.length})</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">Manage apothecary styling clays, beard oils, razor blades, and restocking alerts.</p>
        </div>

        <button
          onClick={() => showToast('Restock Order Sent', 'Reorder PO sent to Trimly Apothecary supplier!', 'success')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Auto-Reorder Low Stock</span>
        </button>
      </div>

      {/* STOCK ECONOMICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY.map(({ label, value, foot, Icon, tone }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                {label}
              </span>
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className={`mt-2 font-serif text-3xl font-bold tabular ${tone}`}>{value}</p>
            <span className="mt-1 block truncate text-[11px] text-slate-500 dark:text-stone-400">{foot}</span>
          </div>
        ))}
      </div>

      {/* PRODUCTS TABLE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-stone-300">
          <thead className="bg-slate-50 dark:bg-black/20 text-slate-500 dark:text-stone-400 uppercase font-semibold border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU / Brand</th>
              <th className="p-3">Cost / Retail Price</th>
              <th className="p-3">Profit Margin</th>
              <th className="p-3">Stock Level</th>
              <th className="p-3 text-right">Adjust Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {products.map(product => {
              const margin = (((product.price - product.costPrice) / product.price) * 100).toFixed(0);
              const isLowStock = product.stockQuantity <= product.reorderThreshold;

              return (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                        <ProductImage src={product.image} alt={product.name} sizes="48px" className="object-cover" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-stone-100">{product.name}</p>
                        <span className="text-[10px] text-slate-500 dark:text-stone-400 font-mono">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-mono text-blue-600 dark:text-blue-400">{product.sku}</p>
                    <p className="text-[10px] text-slate-500 dark:text-stone-400">{product.brand}</p>
                  </td>
                  <td className="p-3 font-mono">
                    <span className="text-slate-500 dark:text-stone-400">${product.costPrice} cost</span> / <span className="font-bold text-slate-900 dark:text-stone-100">${product.price} retail</span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    +{margin}%
                  </td>
                  <td className="p-3">
                    <div className="mb-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${isLowStock ? 'bg-red-500' : 'bg-blue-600 dark:bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (product.stockQuantity / Math.max(1, product.reorderThreshold * 3)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-sm ${isLowStock ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-slate-900 dark:text-stone-100'}`}>
                        {product.stockQuantity} units
                      </span>
                      {isLowStock && (
                        <span className="text-[9px] font-bold bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" /> Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => updateProductStock(product.id, -1)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-stone-300 transition-colors"
                        title="Reduce Stock (-1)"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateProductStock(product.id, 1)}
                        className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500 hover:text-zinc-950 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Add Stock (+1)"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
