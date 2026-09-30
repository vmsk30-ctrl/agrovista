'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCart } from '@/lib/cart/CartContext';
import { useVoiceAssistant } from '@/lib/voice/useVoiceAssistant';
import {
  Sprout,
  ShoppingCart,
  Languages,
  Mic,
  MicOff,
  Volume2,
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
  TrendingUp,
  CloudSun,
  BookOpen,
  FileText,
  FlaskConical,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, role, switchRoleForDemo, logout } = useAuth();
  const { totalItems } = useCart();
  const { isSpeaking, speakText, stopSpeaking } = useVoiceAssistant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleVoiceSummary = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const summaryText =
        language === 'te'
          ? 'ఆగ్రోవిస్టాకు స్వాగతం. రైతుల నుండి నేరుగా వినియోగదారులకు వ్యవసాయ వేదిక. మార్కెట్ ధరలు, AI పంట సలహాలు మరియు తాజా కూరగాయల కోసం మెనూ ఉపయోగించండి.'
          : 'Welcome to AgroVista: AI-Powered Direct Farmer-to-Consumer Agricultural Marketplace. Explore live Telangana mandi prices, AI crop advisor, and direct farm produce.';
      speakText(summaryText);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-agro-100 shadow-sm">
      {/* Top Advisory & Demo Bar */}
      <div className="bg-agro-900 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-agro-400 animate-pulse"></span>
            <span>
              {language === 'te'
                ? 'తెలంగాణ రైతులకు స్వాగతం | కిసాన్ కాల్ సెంటర్: 1800-180-1551'
                : 'Empowering Telangana Farmers | Kisan Call Centre: 1800-180-1551'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-agro-800/80 px-2 py-0.5 rounded text-[11px] text-agro-200 border border-agro-700">
              {t.demoModeBadge}
            </span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 hover:text-agro-200 transition-colors bg-agro-800 px-2.5 py-0.5 rounded-full border border-agro-700"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-agro-400" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agro-500 to-agro-700 flex items-center justify-center text-white shadow-md shadow-agro-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-agro-700 transition-colors">
                Agro<span className="text-agro-600">Vista</span>
              </span>
              <span className="block text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                {language === 'te' ? 'రైతు బజార్' : 'Direct Agri-Market'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/marketplace"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors"
            >
              {t.navMarketplace}
            </Link>
            <Link
              href="/market-prices"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors flex items-center gap-1"
            >
              <TrendingUp className="w-4 h-4 text-agro-600" />
              <span>{t.navPrices}</span>
            </Link>
            <Link
              href="/crop-advisor"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors"
            >
              {t.navAIAdvisor}
            </Link>
            <Link
              href="/fertilizer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors flex items-center gap-1"
            >
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>{t.navFertilizer}</span>
            </Link>
            <Link
              href="/schemes"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors flex items-center gap-1"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{t.navSchemes}</span>
            </Link>
            <Link
              href="/weather"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors flex items-center gap-1"
            >
              <CloudSun className="w-4 h-4 text-sky-600" />
              <span>{t.navWeather}</span>
            </Link>
            <Link
              href="/digital-literacy"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-agro-700 hover:bg-agro-50 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>{t.navLiteracy}</span>
            </Link>
          </nav>

          {/* Action Buttons: Voice Assistant, Cart, Role / Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Voice Assistant Trigger */}
            <button
              onClick={handleVoiceSummary}
              className={`p-2 rounded-xl border transition-all ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                  : 'bg-agro-50 text-agro-700 border-agro-200 hover:bg-agro-100'
              }`}
              title={isSpeaking ? 'Stop Voice Output' : 'Listen to Page Overview (Voice)'}
            >
              {isSpeaking ? (
                <Volume2 className="w-5 h-5 text-amber-700" />
              ) : (
                <Mic className="w-5 h-5 text-agro-700" />
              )}
            </button>

            {/* Cart Icon */}
            <Link
              href="/customer/cart"
              className="relative p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-agro-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Role Switcher & Auth Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-agro-200 bg-agro-50/80 text-agro-900 hover:bg-agro-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-agro-600 text-white flex items-center justify-center text-xs font-bold">
                  {role === 'FARMER' ? 'రైతు' : role === 'ADMIN' ? 'ADM' : role === 'DELIVERY_PARTNER' ? 'DEL' : 'BUY'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-tight text-gray-900 truncate max-w-[110px]">
                    {user?.name || 'Guest User'}
                  </div>
                  <div className="text-[10px] text-agro-700 font-medium">
                    {role || 'Select Role'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Role Dropdown Menu */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500">Active Account</p>
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-agro-600 font-medium">+91 {user?.phone}</p>
                  </div>

                  <div className="p-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
                      Dashboard Navigation
                    </p>
                    {role === 'FARMER' && (
                      <Link
                        href="/farmer"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-agro-50 hover:text-agro-800"
                      >
                        <Sprout className="w-4 h-4 text-agro-600" />
                        Farmer Dashboard
                      </Link>
                    )}
                    {role === 'CUSTOMER' && (
                      <Link
                        href="/customer"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-agro-50 hover:text-agro-800"
                      >
                        <ShoppingCart className="w-4 h-4 text-agro-600" />
                        Customer Dashboard
                      </Link>
                    )}
                    {role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-agro-50 hover:text-agro-800"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        Admin Dashboard
                      </Link>
                    )}
                    {role === 'DELIVERY_PARTNER' && (
                      <Link
                        href="/delivery"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-agro-50 hover:text-agro-800"
                      >
                        <Truck className="w-4 h-4 text-amber-600" />
                        Delivery Dashboard
                      </Link>
                    )}
                  </div>

                  {/* Switch Role Quick Simulation for Evaluator / Testing */}
                  <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                      Demo Role Switcher
                    </p>
                    <button
                      onClick={() => {
                        switchRoleForDemo('FARMER');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-agro-100 flex items-center justify-between"
                    >
                      <span>🌾 Farmer (Lakshmi Bai)</span>
                      {role === 'FARMER' && <span className="text-agro-600 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRoleForDemo('CUSTOMER');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-agro-100 flex items-center justify-between"
                    >
                      <span>🛒 Consumer (Priya Sharma)</span>
                      {role === 'CUSTOMER' && <span className="text-agro-600 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRoleForDemo('DELIVERY_PARTNER');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-agro-100 flex items-center justify-between"
                    >
                      <span>🚚 Delivery Partner</span>
                      {role === 'DELIVERY_PARTNER' && <span className="text-agro-600 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        switchRoleForDemo('ADMIN');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-agro-100 flex items-center justify-between"
                    >
                      <span>🛡️ Platform Admin</span>
                      {role === 'ADMIN' && <span className="text-agro-600 font-bold">✓</span>}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-gray-100 px-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="block w-full text-center py-1.5 text-xs font-semibold text-agro-700 hover:bg-agro-50 rounded-lg"
                    >
                      Mobile OTP Login Flow
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top">
          <Link
            href="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            {t.navMarketplace}
          </Link>
          <Link
            href="/market-prices"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            <TrendingUp className="w-5 h-5 text-agro-600" />
            <span>{t.navPrices}</span>
          </Link>
          <Link
            href="/crop-advisor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            {t.navAIAdvisor}
          </Link>
          <Link
            href="/fertilizer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <span>{t.navFertilizer}</span>
          </Link>
          <Link
            href="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            <FileText className="w-5 h-5 text-amber-600" />
            <span>{t.navSchemes}</span>
          </Link>
          <Link
            href="/weather"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            <CloudSun className="w-5 h-5 text-sky-600" />
            <span>{t.navWeather}</span>
          </Link>
          <Link
            href="/digital-literacy"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:bg-agro-50 hover:text-agro-700"
          >
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>{t.navLiteracy}</span>
          </Link>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href={role === 'FARMER' ? '/farmer' : role === 'CUSTOMER' ? '/customer' : role === 'ADMIN' ? '/admin' : '/delivery'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-agro-600 text-white font-semibold text-sm shadow-sm"
            >
              {t.navDashboard} ({role})
            </Link>
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-xl border border-agro-300 text-agro-800 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Languages className="w-4 h-4 text-agro-600" />
              <span>Change to {language === 'en' ? 'తెలుగు (Telugu)' : 'English'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
