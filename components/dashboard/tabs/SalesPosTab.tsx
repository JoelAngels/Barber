'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { PaymentMethod, SaleItem } from '../../../types';
import { Avatar } from '../../common/Avatar';
import { ProductImage } from '../../common/ProductImage';
import {
  CreditCard,
  Trash2,
  ShoppingBag,
  Scissors,
  Receipt,
  Search,
  Plus,
  Minus,
  Clock,
  AlertTriangle,
  Flame,
} from 'lucide-react';

const PAYMENT_METHODS: readonly PaymentMethod[] = ['Card', 'Cash', 'Apple Pay', 'Loyalty Points'];
const TAX_RATE = 0.08;

type Catalog = 'services' | 'products';

export const SalesPosTab: React.FC = () => {
  const { services, products, barbers, clients, addSaleRecord, updateProductStock, showToast } =
    useApp();

  const [cart, setCart] = useState<SaleItem[]>([]);
  const [catalog, setCatalog] = useState<Catalog>('services');
  const [query, setQuery] = useState('');
  const [selectedClientName, setSelectedClientName] = useState(clients[0]?.name ?? '');
  const [selectedBarberId, setSelectedBarberId] = useState(barbers[0]?.id ?? '');
  const [tipPercentage, setTipPercentage] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');

  const q = query.trim().toLowerCase();

  const visibleServices = useMemo(
    () =>
      services.filter(
        s => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
      ),
    [services, q],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter(
        p => !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
      ),
    [products, q],
  );

  /** Units of a product already in the cart, so stock limits can be enforced. */
  const inCart = (id: string, type: 'service' | 'product') =>
    cart.find(i => i.id === id && i.type === type)?.quantity ?? 0;

  const addItem = (item: { id: string; name: string; price: number; type: 'service' | 'product' }) => {
    if (item.type === 'product') {
      const stock = products.find(p => p.id === item.id)?.stockQuantity ?? 0;
      if (inCart(item.id, 'product') >= stock) {
        showToast('Out of Stock', `Only ${stock} left of ${item.name}`, 'error');
        return;
      }
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.type === item.type);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.type === item.type ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const changeQty = (id: string, type: 'service' | 'product', delta: number) => {
    if (delta > 0 && type === 'product') {
      const stock = products.find(p => p.id === id)?.stockQuantity ?? 0;
      if (inCart(id, 'product') >= stock) {
        showToast('Out of Stock', `Only ${stock} in stock`, 'error');
        return;
      }
    }
    setCart(prev =>
      prev
        .map(i => (i.id === id && i.type === type ? { ...i, quantity: i.quantity + delta } : i))
        .filter(i => i.quantity > 0),
    );
  };

  const removeItem = (id: string, type: 'service' | 'product') =>
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const tipAmount = (subtotal * tipPercentage) / 100;
  const total = subtotal + tax + tipAmount;
  const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const selectedClient = clients.find(c => c.name === selectedClientName);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart Empty', 'Add services or retail products to the register first', 'error');
      return;
    }

    // Every sale must be attributed to a barber so commission splits balance.
    const barber = barbers.find(b => b.id === selectedBarberId);
    if (!barber) {
      showToast('No Barber Selected', 'Attribute this sale to a barber before checkout', 'error');
      return;
    }

    addSaleRecord({
      customerName: selectedClientName,
      barberId: barber.id,
      barberName: barber.name,
      items: cart,
      subtotal,
      tax,
      tipAmount,
      totalAmount: total,
      paymentMethod,
    });

    // Retail leaving the shelf has to leave the stock count too.
    cart
      .filter(i => i.type === 'product')
      .forEach(i => updateProductStock(i.id, -i.quantity));

    setCart([]);
  };

  const tileBase =
    'group relative flex flex-col rounded-xl border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* ------------------------------ CATALOG ------------------------------ */}
      <div className="space-y-4 xl:col-span-2">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04] sm:flex-row sm:items-center">
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-black/30" role="tablist">
            {(
              [
                { id: 'services', label: 'Services', Icon: Scissors, count: services.length },
                { id: 'products', label: 'Retail', Icon: ShoppingBag, count: products.length },
              ] as const
            ).map(({ id, label, Icon, count }) => (
              <button
                key={id}
                role="tab"
                aria-selected={catalog === id}
                onClick={() => setCatalog(id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  catalog === id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                <span
                  className={`rounded-full px-1.5 text-[10px] tabular ${
                    catalog === id ? 'bg-white/20' : 'bg-slate-200 dark:bg-white/10'
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={catalog === 'services' ? 'Search services…' : 'Search products…'}
              aria-label="Search the register catalog"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/30 dark:text-stone-100 dark:placeholder:text-stone-500"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
          {catalog === 'services' ? (
            visibleServices.length ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleServices.map(srv => {
                  const qty = inCart(srv.id, 'service');
                  return (
                    <button
                      key={srv.id}
                      onClick={() =>
                        addItem({ id: srv.id, name: srv.name, price: srv.price, type: 'service' })
                      }
                      className={`${tileBase} border-slate-200 bg-slate-50 p-4 hover:-translate-y-0.5 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-600/5 dark:border-white/10 dark:bg-black/20 dark:hover:border-blue-500/50`}
                    >
                      {qty > 0 && (
                        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white tabular">
                          {qty}
                        </span>
                      )}
                      <div className="mb-2 flex items-center gap-1.5">
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:bg-white/10 dark:text-stone-300">
                          {srv.category}
                        </span>
                        {srv.popular && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                            <Flame className="h-2.5 w-2.5" /> Popular
                          </span>
                        )}
                      </div>
                      <span className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-slate-900 dark:text-stone-100">
                        {srv.name}
                      </span>
                      <div className="mt-3 flex items-end justify-between">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-stone-400">
                          <Clock className="h-3 w-3" /> {srv.durationMinutes} min
                        </span>
                        <span className="font-serif text-lg font-bold tabular text-blue-600 dark:text-blue-400">
                          ${srv.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-slate-500 dark:text-stone-400">
                No services match “{query}”.
              </p>
            )
          ) : visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map(prod => {
                const qty = inCart(prod.id, 'product');
                const remaining = prod.stockQuantity - qty;
                const out = remaining <= 0;
                const low = !out && prod.stockQuantity <= prod.reorderThreshold;
                return (
                  <button
                    key={prod.id}
                    disabled={out}
                    onClick={() =>
                      addItem({ id: prod.id, name: prod.name, price: prod.price, type: 'product' })
                    }
                    className={`${tileBase} overflow-hidden border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-black/20 ${
                      out
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:-translate-y-0.5 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-600/5 dark:hover:border-blue-500/50'
                    }`}
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-200 dark:bg-white/5">
                      <ProductImage
                        src={prod.image}
                        alt={prod.name}
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {qty > 0 && (
                        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white tabular">
                          {qty}
                        </span>
                      )}
                      {out ? (
                        <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Out of stock
                        </span>
                      ) : low ? (
                        <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          <AlertTriangle className="h-2.5 w-2.5" /> {remaining} left
                        </span>
                      ) : null}
                    </div>
                    <div className="p-3">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                        {prod.brand}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block min-h-[2.2rem] text-xs font-bold leading-snug text-slate-900 dark:text-stone-100">
                        {prod.name}
                      </span>
                      <span className="mt-1 block font-serif text-base font-bold tabular text-blue-600 dark:text-blue-400">
                        ${prod.price}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-slate-500 dark:text-stone-400">
              No products match “{query}”.
            </p>
          )}
        </div>
      </div>

      {/* ----------------------------- REGISTER ------------------------------ */}
      <aside className="flex flex-col rounded-2xl border border-blue-500/30 bg-white shadow-2xl dark:bg-white/[0.04] xl:sticky xl:top-[6.5rem] xl:max-h-[calc(100dvh-8rem)]">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-white/10">
          <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-slate-900 dark:text-stone-100">
            <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Checkout Register</span>
          </h3>
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold tabular text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
          {/* Who the sale belongs to */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20">
            <Avatar name={selectedClientName || 'Guest'} src={selectedClient?.avatar} size={40} />
            <div className="min-w-0 flex-1">
              <label htmlFor="pos-client" className="sr-only">
                Select client
              </label>
              <select
                id="pos-client"
                value={selectedClientName}
                onChange={e => setSelectedClientName(e.target.value)}
                className="w-full cursor-pointer truncate bg-transparent text-sm font-bold text-slate-900 focus:outline-none dark:text-stone-100"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 dark:text-stone-400">
                {selectedClient?.loyaltyTier ?? 'Walk-in guest'}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="pos-barber"
              className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-400"
            >
              Barber earner
            </label>
            <select
              id="pos-barber"
              value={selectedBarberId}
              onChange={e => setSelectedBarberId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/30 dark:text-stone-100"
            >
              {barbers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.commissionRate}% split
                </option>
              ))}
            </select>
          </div>

          {/* Cart */}
          {cart.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center dark:border-white/10">
              <ShoppingBag className="mx-auto mb-2 h-7 w-7 text-slate-300 dark:text-stone-600" />
              <p className="text-xs font-semibold text-slate-600 dark:text-stone-300">
                Register is empty
              </p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-stone-500">
                Tap a service or product to ring it up.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {cart.map(item => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-bold text-slate-900 dark:text-stone-100">
                        {item.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-stone-400">
                        {item.type}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
                      <button
                        onClick={() => changeQty(item.id, item.type, -1)}
                        aria-label={`Decrease ${item.name}`}
                        className="rounded-l-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-stone-300 dark:hover:bg-white/10"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-bold tabular text-slate-900 dark:text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => changeQty(item.id, item.type, 1)}
                        aria-label={`Increase ${item.name}`}
                        className="rounded-r-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-stone-300 dark:hover:bg-white/10"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-serif text-sm font-bold tabular text-blue-600 dark:text-blue-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Tip */}
          <div>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-400">
              Barber tip
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 20, 25, 0].map(pct => (
                <button
                  key={pct}
                  onClick={() => setTipPercentage(pct)}
                  aria-pressed={tipPercentage === pct}
                  className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                    tipPercentage === pct
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-500/40 dark:border-white/10 dark:bg-black/30 dark:text-stone-300'
                  }`}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-stone-400">
              Payment method
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  aria-pressed={paymentMethod === method}
                  className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                    paymentMethod === method
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-500/40 dark:border-white/10 dark:bg-black/30 dark:text-stone-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Totals + checkout stay put while the cart scrolls */}
        <div className="border-t border-slate-200 p-5 dark:border-white/10">
          <dl className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-stone-400">
              <dt>Subtotal</dt>
              <dd className="tabular">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-stone-400">
              <dt>Tax ({Math.round(TAX_RATE * 100)}%)</dt>
              <dd className="tabular">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-emerald-600 dark:text-emerald-400">
              <dt>Tip ({tipPercentage}%)</dt>
              <dd className="tabular">${tipAmount.toFixed(2)}</dd>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-slate-200 pt-2 dark:border-white/10">
              <dt className="font-serif text-base font-bold text-slate-900 dark:text-stone-100">
                Total
              </dt>
              <dd className="font-serif text-2xl font-bold tabular text-blue-600 dark:text-blue-400">
                ${total.toFixed(2)}
              </dd>
            </div>
          </dl>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-white/10 dark:disabled:text-stone-500"
          >
            <CreditCard className="h-4 w-4" />
            <span>Process ${total.toFixed(2)}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
