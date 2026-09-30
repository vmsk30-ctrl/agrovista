'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Sprout,
  Users,
  Truck,
  Shield,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { login } = useAuth();

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length !== 10) {
      setError(
        language === 'te'
          ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep('OTP');
        setCooldown(60);
        if (data.sandboxOTP) {
          setSandboxCode(data.sandboxOTP);
          setOtp(data.sandboxOTP); // Pre-fill in sandbox for convenience
        }
        setSuccessMsg(data.message);
      } else {
        setError(data.message || 'Could not send OTP');
        if (data.cooldownRemaining) {
          setCooldown(data.cooldownRemaining);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (otp.trim().length !== 6) {
      setError(
        language === 'te'
          ? 'దయచేసి 6 అంకెల OTP కోడ్ నమోదు చేయండి.'
          : 'Please enter the 6-digit OTP code.'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user);
        setSuccessMsg('Verification successful! Redirecting to your dashboard...');

        // Role-based redirection
        setTimeout(() => {
          if (role === 'FARMER') router.push('/farmer');
          else if (role === 'CUSTOMER') router.push('/customer');
          else if (role === 'ADMIN') router.push('/admin');
          else if (role === 'DELIVERY_PARTNER') router.push('/delivery');
        }, 800);
      } else {
        setError(data.message || t.wrongOTP);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-agro-100 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-agro-500 to-agro-700 flex items-center justify-center text-white shadow-lg shadow-agro-500/25">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {step === 'PHONE' ? t.selectRole : t.verifyOTP}
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            {step === 'PHONE'
              ? language === 'te'
                ? 'మీ మొబైల్ నంబర్ ద్వారా సురక్షిత OTP లాగిన్'
                : 'Secure Mobile OTP Authentication for Rural India'
              : `${t.otpSentTo} ${phone}`}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Step 1: Role Selector + Mobile Number */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            {/* Role Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                {t.selectRole}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Farmer */}
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    role === 'FARMER'
                      ? 'border-agro-600 bg-agro-50/80 ring-2 ring-agro-500'
                      : 'border-gray-200 hover:border-agro-300'
                  }`}
                >
                  <Sprout className={`w-5 h-5 ${role === 'FARMER' ? 'text-agro-600' : 'text-gray-500'}`} />
                  <span className="text-xs font-bold text-gray-900">
                    {language === 'te' ? 'రైతు (Farmer)' : 'Farmer'}
                  </span>
                  <span className="text-[10px] text-gray-500">Sell Harvest</span>
                </button>

                {/* Customer */}
                <button
                  type="button"
                  onClick={() => setRole('CUSTOMER')}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    role === 'CUSTOMER'
                      ? 'border-agro-600 bg-agro-50/80 ring-2 ring-agro-500'
                      : 'border-gray-200 hover:border-agro-300'
                  }`}
                >
                  <Users className={`w-5 h-5 ${role === 'CUSTOMER' ? 'text-agro-600' : 'text-gray-500'}`} />
                  <span className="text-xs font-bold text-gray-900">
                    {language === 'te' ? 'వినియోగదారుడు' : 'Consumer'}
                  </span>
                  <span className="text-[10px] text-gray-500">Buy Fresh</span>
                </button>

                {/* Delivery Partner */}
                <button
                  type="button"
                  onClick={() => setRole('DELIVERY_PARTNER')}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    role === 'DELIVERY_PARTNER'
                      ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${role === 'DELIVERY_PARTNER' ? 'text-amber-600' : 'text-gray-500'}`} />
                  <span className="text-xs font-bold text-gray-900">Delivery</span>
                  <span className="text-[10px] text-gray-500">Transport</span>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                    role === 'ADMIN'
                      ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Shield className={`w-5 h-5 ${role === 'ADMIN' ? 'text-purple-600' : 'text-gray-500'}`} />
                  <span className="text-xs font-bold text-gray-900">Admin</span>
                  <span className="text-[10px] text-gray-500">Manage</span>
                </button>
              </div>
            </div>

            {/* Optional Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                {language === 'te' ? 'మీ పేరు (ఐచ్ఛికం)' : 'Your Name (Optional)'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'FARMER' ? 'e.g. Ramulu Goud' : 'e.g. Priya Sharma'}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agro-500 focus:border-agro-500 text-sm"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                {t.enterMobile}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agro-500 focus:border-agro-500 text-sm tracking-wider font-semibold"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {language === 'te'
                  ? 'మీ ఫోన్‌కు 6 అంకెల OTP SMS పంపబడుతుంది.'
                  : 'A 6-digit SMS verification code will be sent to your mobile.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{t.loading}</span>
              ) : (
                <>
                  <span>{t.sendOTP}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Pre-fills */}
            <div className="pt-2 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-500 mb-2 font-medium">Quick Demo Profiles:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setRole('FARMER');
                    setPhone('9848022334');
                    setName('Ramulu Goud');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-agro-100 text-gray-700 hover:text-agro-800 text-[11px] font-medium"
                >
                  🌾 Farmer (9848022334)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('CUSTOMER');
                    setPhone('9876543210');
                    setName('Priya Sharma');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-agro-100 text-gray-700 hover:text-agro-800 text-[11px] font-medium"
                >
                  🛒 Customer (9876543210)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Enter & Verify OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* Sandbox Notice Banner */}
            {sandboxCode && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Sandbox SMS Verification Code:</span>
                </div>
                <div className="text-lg font-mono font-extrabold tracking-widest text-amber-800">
                  {sandboxCode}
                </div>
                <p className="text-[11px] text-amber-700">
                  (Auto-populated for instant testing without waiting for telecom gateway)
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                {t.enterOTP}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono font-bold text-2xl px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-agro-500 focus:border-agro-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{t.loading}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.verifyOTP}</span>
                </>
              )}
            </button>

            {/* Resend OTP with cooldown timer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-agro-700 font-semibold hover:underline"
              >
                ← Change Number
              </button>

              {cooldown > 0 ? (
                <span>
                  {t.resendCooldown} {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-agro-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.resendOTP}</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
