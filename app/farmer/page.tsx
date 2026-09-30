'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Product, Order, OrderStatus } from '@/types';
import {
  Sprout,
  Plus,
  TrendingUp,
  Package,
  BadgeIndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Leaf,
  FlaskConical,
  FileText,
  CloudSun,
  X,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form fields
  const [newCrop, setNewCrop] = useState('');
  const [newCategory, setNewCategory] = useState<'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'SPICES'>('VEGETABLES');
  const [newPrice, setNewPrice] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState<'kg' | 'quintal' | 'bag'>('kg');
  const [isOrganic, setIsOrganic] = useState(true);
  const [formMsg, setFormMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchFarmerData();
  }, []);

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      // Fetch products for farmer f2 (Lakshmi Bai) or f1 (Ramulu Goud)
      const prodRes = await fetch('/api/products?farmerId=f2');
      const prodData = await prodRes.json();
      if (prodData.products) setProducts(prodData.products);

      // Fetch orders for farmer
      const ordRes = await fetch('/api/orders?farmerId=f2');
      const ordData = await ordRes.json();
      if (ordData.orders) setOrders(ordData.orders);
    } catch (err) {
      console.error('Failed to load farmer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop || !newPrice || !newQuantity) {
      setFormMsg('Please fill all required product fields.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: 'f2',
          crop_name: newCrop,
          category: newCategory,
          farmer_price: Number(newPrice),
          quantity_available: Number(newQuantity),
          unit: newUnit,
          is_organic: isOrganic,
          image_url:
            newCategory === 'VEGETABLES'
              ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewCrop('');
        setNewPrice('');
        setNewQuantity('');
        fetchFarmerData();
      } else {
        setFormMsg(data.message || 'Failed to list product');
      }
    } catch (err: any) {
      setFormMsg(err.message || 'Error listing product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          note: `Farmer confirmed step: ${nextStatus}`,
          location: 'Shamshabad Farm Facility',
        }),
      });
      if (res.ok) {
        fetchFarmerData();
      }
    } catch (err) {
      console.error('Failed to advance order status:', err);
    }
  };

  const totalEarnings = orders
    .filter((o) => o.payment_status === 'PAID')
    .reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farmer Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-agro-900 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div>
          <div className="flex items-center gap-2 text-agro-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4 text-agro-400" />
            <span>{t.farmerOverview}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {user?.name || 'Lakshmi Bai'} — Green Valley Farm
          </h1>
          <p className="text-xs text-agro-200 mt-1">
            Shamshabad, Rangareddy District | 3.2 Acres Organic Command Belt
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-agro-500 hover:bg-agro-400 text-agro-950 font-extrabold text-sm shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>{t.addListing}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>{t.totalEarnings}</span>
            <BadgeIndianRupee className="w-4 h-4 text-agro-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {formatCurrency(totalEarnings)}
          </div>
          <p className="text-[11px] text-agro-700 font-medium">
            ✓ 0% middleman deduction
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>{t.todaysOrders}</span>
            <Package className="w-4 h-4 text-agro-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {orders.length}
          </div>
          <p className="text-[11px] text-gray-500">
            Active customer orders
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>{t.activeProducts}</span>
            <Leaf className="w-4 h-4 text-agro-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {products.length}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            Live on Telangana Marketplace
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>Tomato Mandi Rate</span>
            <TrendingUp className="w-4 h-4 text-agro-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            ₹31/kg
          </div>
          <p className="text-[11px] text-agro-700 font-medium">
            Bowenpally Reference Yard
          </p>
        </div>
      </div>

      {/* Quick Action Agro Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/market-prices"
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-between hover:bg-amber-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span>Mandi Rates & AI</span>
          </span>
          <span>→</span>
        </Link>
        <Link
          href="/crop-advisor"
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-between hover:bg-emerald-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Crop Advisor</span>
          </span>
          <span>→</span>
        </Link>
        <Link
          href="/fertilizer"
          className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 font-bold text-xs flex items-center justify-between hover:bg-green-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-green-700" />
            <span>PJTSAU Fertilizer</span>
          </span>
          <span>→</span>
        </Link>
        <Link
          href="/schemes"
          className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 font-bold text-xs flex items-center justify-between hover:bg-purple-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <span>Govt Schemes</span>
          </span>
          <span>→</span>
        </Link>
      </div>

      {/* Received Orders Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-agro-600" />
            <span>{t.receivedOrders}</span>
          </h2>
          <span className="text-xs bg-agro-100 text-agro-800 font-bold px-3 py-1 rounded-full">
            {orders.length} Active Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">{t.noData}</p>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl border border-gray-200 bg-stone-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-gray-500">
                      Order ID: {ord.id}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Customer: {ord.customer?.user?.name || 'Priya Sharma (Madhapur)'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Deliver to: {ord.shipping_address}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                      {ord.payment_status} ({formatCurrency(ord.total_amount)})
                    </span>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Current Status: <span className="font-bold text-agro-800">{ord.order_status}</span>
                    </p>
                  </div>
                </div>

                {/* Items in order */}
                <div className="text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200 space-y-1">
                  {ord.items?.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>• {it.product?.crop_name || 'Produce Item'} x {it.quantity}</span>
                      <span className="font-bold">{formatCurrency(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons for farmer lifecycle */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  {ord.order_status === 'ORDER_PLACED' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'FARMER_CONFIRMED')}
                      className="px-4 py-2 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs"
                    >
                      ✓ Confirm & Accept Order
                    </button>
                  )}
                  {ord.order_status === 'FARMER_CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'PREPARING')}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                    >
                      🧺 Harvesting & Packing Produce
                    </button>
                  )}
                  {ord.order_status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      📦 Ready for Agent Pickup
                    </button>
                  )}
                  {ord.order_status === 'READY_FOR_PICKUP' && (
                    <span className="text-xs text-agro-800 font-bold bg-agro-100 px-3 py-1.5 rounded-xl">
                      Waiting for Delivery Agent (Suresh Express) to collect from farm
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Farmer's Active Produce Listings */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-agro-600" />
          <span>{t.myProduce}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl border border-gray-200 bg-white flex gap-3 items-center"
            >
              <img
                src={p.image_url}
                alt={p.crop_name}
                className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-sm truncate">{p.crop_name}</h4>
                <div className="text-xs text-agro-700 font-extrabold mt-0.5">
                  {formatCurrency(p.farmer_price)} / {p.unit}
                </div>
                <div className="text-[11px] text-gray-500">
                  {p.quantity_available} {p.unit} available
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-agro-600" />
                <span>{t.addListing}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">
                {formMsg}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Crop / Produce Name
                </label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  placeholder="e.g. Shamshabad Fresh Country Brinjal (వంకాయలు)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
                  >
                    <option value="VEGETABLES">Vegetables</option>
                    <option value="FRUITS">Fruits</option>
                    <option value="SPICES">Spices</option>
                    <option value="GRAINS">Grains / Rice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Unit
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e: any) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="quintal">Quintal</option>
                    <option value="bag">Bag (25kg)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Farmer Price (₹ per unit)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500 font-bold text-agro-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Quantity Available
                  </label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="organic"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded text-agro-600 focus:ring-agro-500"
                />
                <label htmlFor="organic" className="text-xs text-gray-700 font-medium">
                  Naturally grown / Chemical residue free (Organic)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white text-xs font-bold shadow-md"
                >
                  List Produce on Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
