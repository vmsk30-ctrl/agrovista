'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Order, Product } from '@/types';
import {
  ShieldCheck,
  Users,
  Sprout,
  ShoppingCart,
  BadgeIndianRupee,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
        fetch('/api/products'),
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      if (statsData.stats) setStats(statsData.stats);
      if (ordersData.orders) setOrders(ordersData.orders);
      if (productsData.products) setProducts(productsData.products);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
            Telangana State Agri-Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            AgroVista State Admin Command Center
          </h1>
          <p className="text-xs text-purple-200 mt-1">
            System Monitoring, Farmer Verification, and Platform Transactions
          </p>
        </div>
        <ShieldCheck className="w-12 h-12 text-purple-400 hidden sm:block" />
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Total Users</span>
          <div className="text-xl font-extrabold text-gray-900">{stats?.totalUsers || 6}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Farmers</span>
          <div className="text-xl font-extrabold text-agro-700">{stats?.farmersCount || 3}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Consumers</span>
          <div className="text-xl font-extrabold text-blue-700">{stats?.customersCount || 2}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Orders</span>
          <div className="text-xl font-extrabold text-amber-700">{stats?.totalOrders || orders.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Revenue</span>
          <div className="text-xl font-extrabold text-emerald-700">
            {formatCurrency(stats?.totalRevenue || 196)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase block">Live Produce</span>
          <div className="text-xl font-extrabold text-gray-900">{stats?.activeProducts || products.length}</div>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-600" />
          <span>Platform Order Audits & Escrow Payments</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Farmer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Order Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-mono font-bold text-gray-900">{o.id}</td>
                  <td className="p-3 text-gray-500">{formatDate(o.created_at)}</td>
                  <td className="p-3 font-semibold text-agro-800">
                    {o.farmer?.farm_name || 'Shamshabad Farm'}
                  </td>
                  <td className="p-3 font-extrabold text-gray-900">{formatCurrency(o.total_amount)}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-800">{o.order_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
