'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Building,
  QrCode,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryCharge,
    totalAmount,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState(
    'Flat 402, Sunshine Heights, Madhapur, Hyderabad, Telangana - 500081'
  );
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckoutAndPay = async () => {
    if (!shippingAddress.trim() || !phone.trim()) {
      setError('Please provide shipping address and contact phone.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'c1',
          farmer_id: items[0]?.product.farmer_id || 'f2',
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            unit_price: i.product.farmer_price,
          })),
          delivery_charge: deliveryCharge,
          shipping_address: shippingAddress,
          delivery_contact_phone: phone,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize order');
      }

      const orderId = orderData.order.id;

      // 2. Initialize Payment Gateway / Sandbox Order
      const paymentRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: totalAmount,
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.success) {
        throw new Error(paymentData.message || 'Payment initiation failed');
      }

      // 3. Complete Payment & Verify Signature Server-Side
      // Simulating user UPI pin authorization in sandbox
      const mockPaymentId = `pay_sim_${Date.now()}`;
      const mockSignature = `sandbox_sig_${Date.now()}`;

      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          razorpay_order_id: paymentData.gatewayOrderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Payment signature verification failed');
      }

      // Success! Clear cart & display confirmation with delivery tracking
      clearCart();
      setPaymentSuccess({
        orderId,
        trackingReference: orderData.order.delivery?.tracking_reference || 'AGRO-DEL-89211',
        paymentId: mockPaymentId,
      });
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-agro-700 uppercase tracking-widest bg-agro-100 px-3 py-1 rounded-full">
            Payment Verified Server-Side
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {language === 'te' ? 'ఆర్డర్ విజయవంతంగా నమోదయింది!' : 'Order Placed & Confirmed!'}
          </h2>
          <p className="text-sm text-gray-600">
            Payment ID: <span className="font-mono font-bold text-gray-800">{paymentSuccess.paymentId}</span>
          </p>
          <p className="text-sm text-gray-600">
            Tracking Reference: <span className="font-mono font-bold text-agro-700">{paymentSuccess.trackingReference}</span>
          </p>
        </div>

        <div className="bg-agro-50 p-6 rounded-3xl border border-agro-200 text-left text-xs space-y-2">
          <p className="font-bold text-agro-900 text-sm">Next Agricultural Lifecycle Steps:</p>
          <p className="text-gray-700">1. Farmer receives instant order alert & prepares harvest.</p>
          <p className="text-gray-700">2. Fresh produce is packed at Shamshabad farm collection yard.</p>
          <p className="text-gray-700">3. AgroVista delivery partner dispatches directly to your address.</p>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Link
            href="/customer"
            className="px-6 py-3 rounded-2xl bg-agro-600 text-white font-bold text-sm shadow-md hover:bg-agro-700"
          >
            Track in Customer Dashboard
          </Link>
          <Link
            href="/marketplace"
            className="px-6 py-3 rounded-2xl bg-white border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{t.cartEmpty}</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Support rural farmers directly with fresh vegetables, spices, and grains delivered to your doorstep.
        </p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-agro-600 text-white font-bold text-sm shadow-md hover:bg-agro-700"
        >
          <span>{t.shopFreshCTA}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t.cartTitle}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your items and proceed with verified payment.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4"
            >
              <img
                src={product.image_url}
                alt={product.crop_name}
                className="w-20 h-20 rounded-2xl object-cover bg-gray-100 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-agro-700 uppercase">
                  {product.farmer?.farm_name || 'Telangana Farm'}
                </span>
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {product.crop_name}
                </h4>
                <div className="text-xs text-gray-500 mt-0.5">
                  {formatCurrency(product.farmer_price)} / {product.unit}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-agro-600 hover:bg-agro-700 text-white flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="text-right">
                <div className="font-extrabold text-sm text-gray-900">
                  {formatCurrency(product.farmer_price * quantity)}
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-xs text-red-500 hover:text-red-700 p-1 mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs text-gray-500 hover:text-red-600 font-medium underline"
          >
            Clear Entire Cart
          </button>
        </div>

        {/* Right Col: Address & Payment Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-agro-600" />
              <span>{t.shippingAddress}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Full Delivery Street Address
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={t.shippingPlaceholder}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {t.contactPhone}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500 font-semibold"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agro-600" />
              <span>Payment Method (Razorpay Sandbox)</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-agro-600 bg-agro-50 ring-2 ring-agro-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className="w-5 h-5 text-agro-700" />
                <span className="text-xs font-bold">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-agro-600 bg-agro-50 ring-2 ring-agro-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-agro-700" />
                <span className="text-xs font-bold">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-agro-600 bg-agro-50 ring-2 ring-agro-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building className="w-5 h-5 text-agro-700" />
                <span className="text-xs font-bold">NetBank</span>
              </button>
            </div>

            <p className="text-[11px] text-gray-500">
              {t.sandboxPaymentNotice}
            </p>
          </div>

          {/* Bill Summary */}
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>

            <div className="flex justify-between text-xs text-gray-600">
              <span>{t.subtotal}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>{t.deliveryFee}</span>
              <span>{deliveryCharge === 0 ? 'FREE' : formatCurrency(deliveryCharge)}</span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-base text-gray-900">
              <span>{t.totalAmount}</span>
              <span className="text-agro-800">{formatCurrency(totalAmount)}</span>
            </div>

            <button
              onClick={handleCheckoutAndPay}
              disabled={processing}
              className="w-full py-4 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-lg shadow-agro-600/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {processing ? (
                <span>Verifying Payment Server-Side...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay {formatCurrency(totalAmount)} Securely</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
