'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { SEED_LITERACY_GUIDES } from '@/lib/seedData';
import { DigitalLiteracyGuide } from '@/types';
import {
  BookOpen,
  ShieldAlert,
  Sprout,
  Landmark,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export default function DigitalLiteracyPage() {
  const { language, t } = useLanguage();
  const [selectedGuide, setSelectedGuide] = useState<DigitalLiteracyGuide>(
    SEED_LITERACY_GUIDES[0]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-6 sm:p-10 rounded-3xl shadow-lg">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-600 text-xs font-semibold text-purple-200">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Rural Telangana Digital Inclusion Initiative</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.literacyTitle}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            {t.literacySub}
          </p>
        </div>
      </div>

      {/* Guide Topic Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {SEED_LITERACY_GUIDES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGuide(g)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              selectedGuide.id === g.id
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {language === 'te' ? g.telugu_title : g.title}
          </button>
        ))}
      </div>

      {/* Active Guide Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
            Category: {selectedGuide.category}
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
            {language === 'te' ? selectedGuide.telugu_title : selectedGuide.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {language === 'te' ? selectedGuide.telugu_summary : selectedGuide.summary}
          </p>
        </div>

        {/* Step-by-Step Pictorial Guide */}
        <div className="space-y-6">
          {selectedGuide.steps.map((step) => (
            <div
              key={step.step_number}
              className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {step.step_number}
                </div>
                <h4 className="font-bold text-gray-900 text-base">
                  {language === 'te' ? step.telugu_instruction : step.instruction}
                </h4>
              </div>

              {/* Helpful Tip */}
              <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900 flex items-start gap-2 border border-purple-100">
                <Lightbulb className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Helpful Tip: </span>
                  {step.tip}
                </div>
              </div>

              {/* Warning (if scam protection) */}
              {step.warning && (
                <div className="p-3 bg-red-50 rounded-xl text-xs text-red-900 flex items-start gap-2 border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">CRITICAL WARNING: </span>
                    {step.warning}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
