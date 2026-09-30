'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SEED_FERTILIZER_GUIDES } from '@/lib/seedData';
import { FertilizerGuidance } from '@/types';
import {
  FlaskConical,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function FertilizerPage() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy / Rice (వరి)');

  const guide =
    SEED_FERTILIZER_GUIDES.find((g) => g.crop === selectedCrop) ||
    SEED_FERTILIZER_GUIDES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-agro-950 text-white p-6 sm:p-10 rounded-3xl shadow-lg">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-600 text-xs font-semibold text-teal-200">
            <FlaskConical className="w-3.5 h-3.5 text-teal-400" />
            <span>Authoritative Agronomy Guidelines</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.fertilizerGuideTitle}
          </h1>
          <p className="text-xs sm:text-sm text-teal-200">
            {t.fertilizerSub}
          </p>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {SEED_FERTILIZER_GUIDES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedCrop(g.crop)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              selectedCrop === g.crop
                ? 'bg-agro-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {g.crop}
          </button>
        ))}
      </div>

      {/* Main Guidance Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-agro-700 uppercase tracking-wider block">
              Growth Stage: {guide.growth_stage}
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
              Nutrient Package for {guide.crop}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Soil Condition: {guide.soil_condition}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-agro-800 bg-agro-100 px-3 py-1 rounded-full inline-block">
              Stage: {guide.growth_stage}
            </span>
          </div>
        </div>

        {/* Scientific Dosages Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-agro-600" />
            <span>Recommended Scientific Fertilizer Dosages</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.recommended_fertilizers.map((fert, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-gray-200 bg-stone-50/60 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    {fert.name}
                  </h4>
                  <span className="text-xs font-bold text-agro-800 bg-white px-2 py-0.5 rounded-lg border border-gray-200">
                    {fert.dosage_per_acre}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Application: </span>
                    {fert.application_method}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Timing: </span>
                    {fert.timing}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organic Alternatives */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
          <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-700" />
            <span>Organic & Natural Alternatives (Zero Chemical Residue)</span>
          </h3>
          <ul className="text-xs text-emerald-900 space-y-1">
            {guide.organic_alternatives.map((org, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{org}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Precautions */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Field Precautions & Warnings</span>
          </h3>
          <ul className="text-xs text-amber-900 space-y-1">
            {guide.precautions.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-amber-700">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Authoritative Source Attribution & Verification Date */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
          <div>
            <span>Attribution Source: </span>
            <a
              href={guide.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-agro-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>{guide.source}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last University Verification: {guide.last_verified}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
