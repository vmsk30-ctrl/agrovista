'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Sprout, PhoneCall, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-agro-950 text-white border-t border-agro-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-agro-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Agro<span className="text-agro-400">Vista</span>
              </span>
            </div>
            <p className="text-agro-200 text-sm leading-relaxed">
              {language === 'te'
                ? 'తెలంగాణ చిన్న మరియు సన్నకారు రైతుల కోసం ప్రత్యేకంగా రూపొందించిన డిజిటల్ మార్కెట్‌ప్లేస్. దళారులు లేకుండా నేరుగా అమ్మకాలు.'
                : 'Direct farmer-to-consumer agricultural marketplace designed specifically for small & marginal farmers in Telangana, India.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-agro-300 bg-agro-900/60 p-2.5 rounded-xl border border-agro-800">
              <ShieldCheck className="w-4 h-4 text-agro-400 shrink-0" />
              <span>
                {language === 'te'
                  ? 'ధృవీకరించబడిన రైతులు & న్యాయమైన మార్కెట్ ధరలు'
                  : 'Verified farmers & transparent mandi price intelligence'}
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-agro-400">
              {language === 'te' ? 'వేదిక విభాగాలు' : 'Platform Features'}
            </h4>
            <ul className="space-y-2.5 text-sm text-agro-200">
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  {t.navMarketplace}
                </Link>
              </li>
              <li>
                <Link href="/market-prices" className="hover:text-white transition-colors">
                  {t.navPrices} (Bowenpally, Enumamula)
                </Link>
              </li>
              <li>
                <Link href="/crop-advisor" className="hover:text-white transition-colors">
                  {t.navAIAdvisor}
                </Link>
              </li>
              <li>
                <Link href="/fertilizer" className="hover:text-white transition-colors">
                  {t.navFertilizer} (PJTSAU)
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-white transition-colors">
                  {t.navSchemes}
                </Link>
              </li>
              <li>
                <Link href="/digital-literacy" className="hover:text-white transition-colors">
                  {t.navLiteracy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Government & Agri Portals */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-agro-400">
              {language === 'te' ? 'అధికారిక వ్యవసాయ పోర్టల్స్' : 'Authoritative Portals'}
            </h4>
            <ul className="space-y-2.5 text-sm text-agro-200">
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Agmarknet National Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-agro-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pjtsau.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>PJTSAU Agricultural University</span>
                  <ExternalLink className="w-3.5 h-3.5 text-agro-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://rythubandhu.telangana.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Telangana Rythu Bandhu</span>
                  <ExternalLink className="w-3.5 h-3.5 text-agro-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>PM-KISAN Central Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-agro-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://mausam.imd.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>IMD Telangana Agro-Met</span>
                  <ExternalLink className="w-3.5 h-3.5 text-agro-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Farmer Help & Helplines */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base mb-2 tracking-wide uppercase text-xs text-agro-400">
              {language === 'te' ? 'రైతు సహాయ కేంద్రం' : 'Farmer Helplines'}
            </h4>
            <div className="bg-agro-900/80 p-4 rounded-2xl border border-agro-800 space-y-2">
              <div className="flex items-center gap-2 text-agro-300 text-xs font-semibold">
                <PhoneCall className="w-4 h-4 text-agro-400" />
                <span>Kisan Call Centre (Toll-Free)</span>
              </div>
              <p className="text-xl font-extrabold text-white tracking-wider">1800-180-1551</p>
              <p className="text-[11px] text-agro-400">6:00 AM to 10:00 PM (All 7 Days in Telugu & English)</p>
            </div>
            <div className="text-xs text-agro-300">
              <span>AgroVista Telangana Support: </span>
              <span className="text-white font-medium">support@agrovista.in</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-agro-900/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-agro-400">
          <p>
            © {new Date().getFullYear()} AgroVista Technologies. Dedicated to the farmers of India.
          </p>
          <div className="flex items-center gap-1">
            <span>Built with care for rural digital inclusion</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
