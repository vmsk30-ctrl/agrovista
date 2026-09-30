'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Sprout,
  TrendingUp,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  BadgeIndianRupee,
  Smartphone,
  ChevronRight,
  Flame,
  Leaf,
  Scale,
} from 'lucide-react';
import { SEED_PRODUCTS, SEED_MARKET_PRICES } from '@/lib/seedData';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { switchRoleForDemo } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agro-50/70 via-white to-stone-50/50 pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-agro-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Subheading, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agro-100 text-agro-800 text-xs sm:text-sm font-semibold border border-agro-200">
                <Sparkles className="w-4 h-4 text-agro-600" />
                <span>
                  {language === 'te'
                    ? 'తెలంగాణ రైతు సాధికారత వేదిక 2026'
                    : 'Direct Agri-Marketplace & AI Mandi Intelligence'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                {language === 'te' ? (
                  <>
                    రైతుల నుండి కుటుంబాలకు,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-600 to-emerald-700">
                      నేరుగా మరియు తాజాగా.
                    </span>
                  </>
                ) : (
                  <>
                    From Farmers to Families,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-600 to-emerald-700">
                      Directly.
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                {t.heroSubheading}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-base shadow-lg shadow-agro-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sprout className="w-5 h-5" />
                  <span>{t.shopFreshCTA}</span>
                </Link>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-agro-50 text-agro-800 border-2 border-agro-300 font-bold text-base shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Users className="w-5 h-5 text-agro-600" />
                  <span>{t.sellProduceCTA}</span>
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0" />
                  <span>{language === 'te' ? '0% దళారీ కమీషన్' : '0% Middleman Cut'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0" />
                  <span>{language === 'te' ? 'రోజువారీ మార్కెట్ ధరలు' : 'Daily Mandi Rates'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-agro-600 shrink-0" />
                  <span>{language === 'te' ? 'గ్రామం నుంచి పికప్' : 'Village-Gate Pickup'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-agro-100/80">
                {/* Visual badge */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {language === 'te' ? 'ఈ ఉదయం కోసిన పంట' : 'Harvested This Morning'}
                    </span>
                  </div>
                  <span className="text-xs bg-agro-100 text-agro-800 font-bold px-2 py-0.5 rounded-full">
                    Warangal & Rangareddy
                  </span>
                </div>

                {/* Sample Produce Feature Card */}
                <div className="mt-4 space-y-4">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80"
                      alt="Fresh Telangana Tomatoes"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-medium">
                      Farmer: Lakshmi Bai (Shamshabad)
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {language === 'te' ? 'నాటు టమాటాలు' : 'Vine Country Tomatoes'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {language === 'te' ? 'రంగారెడ్డి జిల్లా | సహజ పద్ధతి' : 'Rangareddy | 100% Residue Free'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 line-through">Retail ₹48/kg</div>
                      <div className="text-2xl font-extrabold text-agro-700">₹32/kg</div>
                    </div>
                  </div>

                  {/* Impact Breakdown */}
                  <div className="bg-agro-50 p-3 rounded-xl border border-agro-200/60 text-xs space-y-1.5">
                    <div className="flex justify-between font-semibold text-agro-900">
                      <span>Farmer Retains (88%):</span>
                      <span className="text-agro-700">₹28.16</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Logistics & Handling:</span>
                      <span>₹3.84</span>
                    </div>
                    <div className="text-[11px] text-agro-700 font-medium pt-1 border-t border-agro-200">
                      ✓ Traditional middleman cut avoided: ₹16 saved per kg!
                    </div>
                  </div>

                  <Link
                    href="/marketplace"
                    className="block w-full py-2.5 text-center bg-agro-600 hover:bg-agro-700 text-white rounded-xl font-bold text-sm shadow-md"
                  >
                    {language === 'te' ? 'మరిన్ని పంటలు చూడండి' : 'Explore All Farm Listings'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW AGROVISTA WORKS (Interactive 4-Step Diagram) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {language === 'te' ? 'ఆగ్రోవిస్టా ఎలా పనిచేస్తుంది?' : 'How AgroVista Bridges The Gap'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {language === 'te'
              ? 'రైతుల శ్రమకు తగిన ఫలితం, వినియోగదారులకు నాణ్యమైన తాజా ఆహారం.'
              : 'A transparent, tech-powered agricultural supply chain engineered for fairness and freshness.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              {language === 'te' ? 'రైతు పంట నమోదు' : 'Farmer Lists Harvest'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'te'
                ? 'రైతులు తమ స్మార్ట్‌ఫోన్ ద్వారా పంట ఫోటో, పరిమాణం మరియు వారు కోరుకున్న ధరను నమోదు చేస్తారు.'
                : 'Farmers list produce with transparent prices pegged higher than commission yard rates.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              {language === 'te' ? 'వినియోగదారు ఆర్డర్' : 'Direct Consumer Order'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'te'
                ? 'నగరాల్లోని కుటుంబాలు తాజా కూరగాయలు, బియ్యం, పప్పులను నేరుగా ఆర్డర్ చేస్తారు.'
                : 'Urban households order unadulterated produce directly from identified local farmers.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              {language === 'te' ? 'గ్రామ పికప్ & రవాణా' : 'Farm-Gate Collection'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'te'
                ? 'రైతు నిర్ధారించగానే ఆగ్రోవిస్టా డెలివరీ ఏజెంట్ పొలం వద్దకే వచ్చి సరుకు తీసుకుంటారు.'
                : 'Our local logistics partner collects packed crates directly from the village packing shed.'}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-agro-100 text-agro-700 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">
              {language === 'te' ? 'ఇంటికి డెలివరీ & నగదు' : 'Doorstep Freshness'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'te'
                ? 'వినియోగదారుడి ఇంటికి 12-24 గంటల్లో చేరుతుంది. రైతు ఖాతాలోకి నేరుగా డబ్బు జమ అవుతుంది.'
                : 'Delivered within 12-24 hours. The farmer receives payment directly into their bank account.'}
            </p>
          </div>
        </div>
      </section>

      {/* LIVE TELANGANA MANDI INTELLIGENCE TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agro-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-agro-600" />
                <h3 className="text-xl font-bold text-gray-900">{t.liveMandiPrices}</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.officialSource}</p>
            </div>
            <Link
              href="/market-prices"
              className="text-xs font-bold text-agro-700 hover:text-agro-800 flex items-center gap-1 bg-agro-50 px-3 py-1.5 rounded-xl border border-agro-200"
            >
              <span>{language === 'te' ? 'పూర్తి మార్కెట్ వివరాలు' : 'View All 33 Districts'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mandi Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEED_MARKET_PRICES.slice(0, 3).map((mp) => (
              <div
                key={mp.id}
                className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 hover:border-agro-400 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-agro-700 uppercase tracking-wide">
                      {mp.district}
                    </span>
                    <h4 className="font-bold text-gray-900 text-base">{mp.crop_name}</h4>
                    <p className="text-xs text-gray-500">{mp.market}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase block">Modal Rate</span>
                    <span className="text-lg font-extrabold text-gray-900">
                      ₹{mp.modal_price}
                    </span>
                    <span className="text-[11px] text-gray-500 block">/ {mp.unit}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200/60 flex justify-between text-[11px] text-gray-600">
                  <span>Min: ₹{mp.min_price}</span>
                  <span>Max: ₹{mp.max_price}</span>
                  <span className="text-agro-700 font-medium">Verified Agmarknet</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE MODULES SHOWCASE (AI Prediction, Crop Advisor, Fertilizer, Schemes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {language === 'te' ? 'రైతు సాధికారత సాంకేతికతలు' : 'Farmer Advisory Ecosystem'}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {language === 'te'
              ? 'సాంకేతికతతో కూడిన శాస్త్రీయ వ్యవసాయ సేవలు ఒక్క క్లిక్‌తో.'
              : 'Integrated agro-technological tools designed specifically for Telangana cropping patterns.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AI Price Forecast */}
          <Link
            href="/market-prices"
            className="group bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-3xl border border-amber-200/70 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {language === 'te' ? 'AI ధరల అంచనా' : 'AI 7-Day Forecast'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {language === 'te'
                ? 'మార్కెట్ రాకలు, వాతావరణం ఆధారంగా రాబోయే 7 రోజుల పంట ధరల ముందస్తు అంచనా.'
                : 'Empowers farmers to decide whether to sell today or hold for better mandi auctions.'}
            </p>
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Predictions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 2: Crop Advisor */}
          <Link
            href="/crop-advisor"
            className="group bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 rounded-3xl border border-emerald-200/70 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {language === 'te' ? 'పంట సలహాదారు' : 'PJTSAU Crop Advisor'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {language === 'te'
                ? 'మీ నేల రకం, నీటి వనరు మరియు సీజన్ ఆధారంగా అధిక లాభసాటి పంటల ఎంపిక.'
                : 'Tailored recommendations for Telangana red loam, black cotton, and alluvial soils.'}
            </p>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Run Soil Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 3: Fertilizer Guidance */}
          <Link
            href="/fertilizer"
            className="group bg-gradient-to-br from-green-50 to-lime-50/50 p-6 rounded-3xl border border-green-200/70 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-agro-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {language === 'te' ? 'ఎరువుల మార్గదర్శి' : 'Fertilizer Guidance'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {language === 'te'
                ? 'వరి, మిర్చి, పత్తి పంటలకు దశలవారీగా పోషకాల మోతాదు మరియు జాగ్రత్తలు.'
                : 'Authoritative, non-hallucinated dosage recommendations direct from PJTSAU agronomists.'}
            </p>
            <span className="text-xs font-bold text-agro-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Check Dosages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Card 4: Digital Literacy & Safety */}
          <Link
            href="/digital-literacy"
            className="group bg-gradient-to-br from-purple-50 to-pink-50/50 p-6 rounded-3xl border border-purple-200/70 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {language === 'te' ? 'డిజిటల్ పరిజ్ఞానం' : 'Farmer Digital Guide'}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              {language === 'te'
                ? 'UPI వాడకం, సైబర్ మోసాల నివారణ మరియు ఆన్‌లైన్ పథకాలపై బొమ్మలతో వివరణలు.'
                : 'Simple pictorial guides in Telugu on UPI security, avoiding scams, and smartphone mastery.'}
            </p>
            <span className="text-xs font-bold text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* QUICK ROLE DEMO BAR (For Evaluators) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-agro-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <span className="bg-agro-800 text-agro-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Full-Stack Architecture Evaluation
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                Experience AgroVista From Every Stakeholder Role
              </h3>
              <p className="text-xs sm:text-sm text-agro-200 max-w-xl">
                Test the complete lifecycle: Farmer adds produce → Customer orders → Sandbox Payment → Farmer confirms → Delivery agent updates tracking.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <Link
                href="/farmer"
                onClick={() => switchRoleForDemo('FARMER')}
                className="px-4 py-2.5 rounded-xl bg-agro-600 hover:bg-agro-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                🌾 Farmer Dashboard
              </Link>
              <Link
                href="/customer"
                onClick={() => switchRoleForDemo('CUSTOMER')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                🛒 Customer Dashboard
              </Link>
              <Link
                href="/delivery"
                onClick={() => switchRoleForDemo('DELIVERY_PARTNER')}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                🚚 Delivery Tracking
              </Link>
              <Link
                href="/admin"
                onClick={() => switchRoleForDemo('ADMIN')}
                className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                🛡️ Admin Command Center
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
