'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { GovernmentScheme } from '@/types';
import {
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Landmark,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function GovernmentSchemesPage() {
  const { language, t } = useLanguage();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>('sch1');

  useEffect(() => {
    fetchSchemes();
  }, [selectedState]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const url =
        selectedState === 'ALL'
          ? '/api/schemes'
          : `/api/schemes?state=${selectedState}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.schemes) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.telugu_name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-agro-950 text-white p-6 sm:p-10 rounded-3xl shadow-lg">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/60 border border-amber-600 text-xs font-semibold text-amber-200">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Government Welfare & DBT Registry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.schemesTitle}
          </h1>
          <p className="text-xs sm:text-sm text-amber-200">
            {t.schemesSub}
          </p>
        </div>
      </div>

      {/* Search & State Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Rythu Bandhu, PM-KISAN, Drip Subsidy..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-agro-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedState('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedState === 'ALL'
                ? 'bg-agro-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Schemes
          </button>
          <button
            onClick={() => setSelectedState('Telangana')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedState === 'Telangana'
                ? 'bg-agro-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Telangana State
          </button>
          <button
            onClick={() => setSelectedState('Central')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedState === 'Central'
                ? 'bg-agro-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Central Govt
          </button>
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isExpanded = expandedId === scheme.id;

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Card Header Banner */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                className="p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-agro-700 uppercase tracking-wider bg-agro-50 px-2.5 py-0.5 rounded-full border border-agro-200">
                      {scheme.state}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Verified: {scheme.last_verified}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {scheme.name}
                  </h3>
                  <p className="text-xs font-bold text-agro-800 mt-0.5">
                    {scheme.telugu_name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={scheme.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-agro-50 hover:bg-agro-100 text-agro-800 border border-agro-300 text-xs font-bold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Scheme Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-6 animate-in fade-in">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Eligibility */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wide text-gray-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-agro-600" />
                        <span>{t.eligibility}</span>
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1.5">
                        {scheme.eligibility.map((el, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-agro-600 font-bold">•</span>
                            <span>{el}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wide text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{t.benefits}</span>
                      </h4>
                      <ul className="text-xs text-emerald-950 space-y-1.5">
                        {scheme.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-700 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <h4 className="font-bold text-xs uppercase tracking-wide text-amber-950 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>{t.documentsRequired}</span>
                      </h4>
                      <ul className="text-xs text-amber-950 space-y-1.5">
                        {scheme.required_documents.map((d, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-700 font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step by step application process */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-gray-800">
                      Step-by-Step Application Process:
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      {scheme.application_process.map((step, i) => (
                        <p key={i} className="pl-3 border-l-2 border-agro-500 py-0.5">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Official Source footer */}
                  <div className="pt-2 text-[11px] text-gray-400">
                    Source: {scheme.source}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
