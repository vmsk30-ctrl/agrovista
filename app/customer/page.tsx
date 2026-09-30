'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ChevronRight,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const LIFECYCLE_STEPS: { status: OrderStatus; label: string; teluguLabel: string }[] = [
  { status: 'ORDER_PLACED', label: 'Order Placed', teluguLabel: 'ఆర్డర్ నమోదయింది' },
  { status: 'FARMER_CONFIRMED', label: 'Farmer Confirmed', teluguLabel: 'రైతు అంగీకరించారు' },
  { status: 'PREPARING', label: 'Harvesting & Packing', teluguLabel: 'తాజాగా కోసి ప్యాక్ చేస్తున్నారు' },
  { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', teluguLabel: 'రవాణాకు సిద్ధం' },
  { status: 'PICKED_UP', label: 'Picked Up by Agent', teluguLabel: 'ఏజెంట్ తీసుకున్నారు' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', teluguLabel: 'మీ ఇంటికి వస్తున్నారు' },
  { status: 'DELIVERED', label: 'Delivered Fresh', teluguLabel: 'డెలివరీ పూర్తయింది' },
];

export default function CustomerDashboard() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders?customerId=c1');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrder = orders[0]; // Most recent active order

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-agro-900 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-agro-300 uppercase tracking-wider block">
            AgroVista Consumer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Namaste, {user?.name || 'Priya Sharma'}!
          </h1>
          <p className="text-xs text-agro-200 mt-1">
            Directly supporting farmers in Rangareddy & Warangal districts.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="px-5 py-3 rounded-2xl bg-white text-gray-900 font-bold text-sm shadow hover:bg-gray-100 flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4 text-agro-600" />
          <span>Shop Fresh Farm Produce</span>
        </Link>
      </div>

      {/* ACTIVE ORDER & VISUAL TRACKING TIMELINE */}
      {activeOrder && (
        <div className="bg-white rounded-3xl border border-agro-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-agro-600 animate-ping"></span>
                <span className="text-xs font-bold text-agro-800 uppercase tracking-wider">
                  Live Farm-To-Door Tracking
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                Order #{activeOrder.id}
              </h2>
              <p className="text-xs text-gray-500">
                Tracking Ref: <span className="font-mono font-bold text-agro-700">{activeOrder.delivery?.tracking_reference || 'AGRO-DEL-89211'}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                {activeOrder.order_status}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Total: <span className="font-bold text-gray-900">{formatCurrency(activeOrder.total_amount)}</span>
              </p>
            </div>
          </div>

          {/* Visual Step-by-Step Delivery Progress Bar */}
          <div className="py-4 overflow-x-auto">
            <div className="min-w-[700px] flex items-center justify-between relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-gray-200 -z-0"></div>

              {LIFECYCLE_STEPS.map((step, idx) => {
                const currentIdx = LIFECYCLE_STEPS.findIndex((s) => s.status === activeOrder.order_status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step.status} className="flex flex-col items-center relative z-10 text-center px-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-agro-600 text-white ring-4 ring-agro-200 scale-110 shadow-md'
                          : isPassed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 max-w-[90px] leading-tight ${
                        isCurrent ? 'text-agro-900 font-extrabold' : isPassed ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {language === 'te' ? step.teluguLabel : step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Farmer Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
              <span className="font-bold text-gray-800 block">Farmer & Collection Source:</span>
              <p className="text-gray-600">
                Farm: <span className="font-bold text-gray-900">{activeOrder.farmer?.farm_name || 'Green Valley Agro Farm'}</span>
              </p>
              <p className="text-gray-600">
                Location: Shamshabad, Rangareddy District, Telangana
              </p>
              <div className="pt-1 flex items-center gap-3">
                <span className="text-agro-700 font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 9440188992</span>
                </span>
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
              <span className="font-bold text-gray-800 block">Delivery Destination:</span>
              <p className="text-gray-600 leading-relaxed">
                {activeOrder.shipping_address}
              </p>
              <p className="text-agro-700 font-medium pt-1">
                ✓ Guaranteed unadulterated & fresh morning delivery
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order History */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-agro-600" />
          <span>Past Orders</span>
        </h2>

        {orders.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">{t.noData}</p>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gray-700">
                      {ord.id}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      • {formatDate(ord.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {ord.items?.map((it) => `${it.product?.crop_name || 'Produce'} (x${it.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 block">
                    {formatCurrency(ord.total_amount)}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {ord.order_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
