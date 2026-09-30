'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Order, OrderStatus } from '@/types';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Navigation,
  Phone,
  Clock,
  Package,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DeliveryDashboard() {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId: string, nextStatus: OrderStatus, note: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          note,
          location: 'Telangana Delivery Transit Hub',
        }),
      });

      if (res.ok) {
        fetchDeliveries();
      }
    } catch (err) {
      console.error('Failed to update delivery status:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
            AgroVista Express Logistics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Delivery Partner Portal — Suresh Telangana Express
          </h1>
          <p className="text-xs text-amber-200 mt-1">
            Assigned Routes: Shamshabad Farm Belt → Hyderabad Urban Clusters
          </p>
        </div>
        <Truck className="w-12 h-12 text-amber-400 hidden sm:block" />
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-600" />
          <span>Active Assigned Dispatches ({orders.length})</span>
        </h2>

        {orders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Tracking: {ord.delivery?.tracking_reference || 'AGRO-DEL-89211'}
                </span>
                <h3 className="font-extrabold text-gray-900 text-base mt-1">
                  Order #{ord.id}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-700 block">
                  Status: <span className="text-agro-700">{ord.order_status}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Total Payable: {formatCurrency(ord.total_amount)} (Pre-paid Online)
                </span>
              </div>
            </div>

            {/* Pickup & Drop Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Farm */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <span className="font-bold text-agro-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-agro-600" />
                  <span>Farm Pickup Location:</span>
                </span>
                <p className="font-bold text-gray-900">
                  {ord.farmer?.farm_name || 'Green Valley Agro Farm'}
                </p>
                <p className="text-gray-600">
                  Village: Shamshabad, Rangareddy District
                </p>
                <p className="text-gray-600">Farmer Contact: +91 9440188992 (Lakshmi Bai)</p>
              </div>

              {/* Delivery Drop */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <span className="font-bold text-amber-800 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span>Customer Destination:</span>
                </span>
                <p className="font-bold text-gray-900">
                  {ord.shipping_address}
                </p>
                <p className="text-gray-600">Customer Phone: +91 {ord.delivery_contact_phone}</p>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="pt-2 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-gray-700 mr-2">Update Stage:</span>

              {ord.order_status === 'READY_FOR_PICKUP' && (
                <button
                  onClick={() =>
                    updateDeliveryStatus(ord.id, 'PICKED_UP', 'Picked up fresh crates from Shamshabad collection shed')
                  }
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                >
                  ✓ Confirm Farm Pickup
                </button>
              )}

              {ord.order_status === 'PICKED_UP' && (
                <button
                  onClick={() =>
                    updateDeliveryStatus(ord.id, 'OUT_FOR_DELIVERY', 'Van out for delivery in Madhapur / Hitec City zone')
                  }
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                >
                  🚚 Set Out for Doorstep Delivery
                </button>
              )}

              {ord.order_status === 'OUT_FOR_DELIVERY' && (
                <button
                  onClick={() =>
                    updateDeliveryStatus(ord.id, 'DELIVERED', 'Delivered safely to customer doorstep')
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  🎉 Complete Delivery
                </button>
              )}

              {ord.order_status === 'DELIVERED' && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order Fully Delivered & Closed</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
