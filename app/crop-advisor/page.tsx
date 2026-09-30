'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { CropRecommendationInput, CropRecommendationOutput } from '@/types';
import {
  Sprout,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Droplet,
  BadgeIndianRupee,
  ShieldAlert,
} from 'lucide-react';

const TELANGANA_DISTRICTS = [
  'Warangal',
  'Rangareddy',
  'Nalgonda',
  'Adilabad',
  'Khammam',
  'Karimnagar',
  'Siddipet',
  'Mahabubnagar',
];

export default function CropAdvisorPage() {
  const { language, t } = useLanguage();

  const [district, setDistrict] = useState('Warangal');
  const [season, setSeason] = useState<'KHARIF' | 'RABI' | 'ZAID'>('KHARIF');
  const [soilType, setSoilType] = useState<CropRecommendationInput['soil_type']>('BLACK_COTTON');
  const [waterAvailability, setWaterAvailability] = useState<CropRecommendationInput['water_availability']>('BOREWELL');
  const [farmSize, setFarmSize] = useState('4.0');
  const [previousCrop, setPreviousCrop] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendationOutput[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/crop-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          season,
          soil_type: soilType,
          water_availability: waterAvailability,
          farm_size_acres: parseFloat(farmSize) || 4.0,
          previous_crop: previousCrop,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to get crop recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-agro-900 text-white p-6 sm:p-10 rounded-3xl shadow-lg">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500 text-xs font-semibold text-emerald-200">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>PJTSAU & ICAR Agronomic Knowledge Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.cropAdvisorTitle}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            {t.cropAdvisorSub}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Farm Parameters Input</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Telangana District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
              >
                {TELANGANA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Season
                </label>
                <select
                  value={season}
                  onChange={(e: any) => setSeason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
                >
                  <option value="KHARIF">Kharif (Monsoon / వానాకాలం)</option>
                  <option value="RABI">Rabi (Winter / యాసంగి)</option>
                  <option value="ZAID">Zaid (Summer / వేసవి)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Soil Type (నేల రకం)
              </label>
              <select
                value={soilType}
                onChange={(e: any) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
              >
                <option value="BLACK_COTTON">Black Cotton Soil (నల్లరేగడి నేలలు)</option>
                <option value="RED_SANDY">Red Sandy Loam (ఎర్ర నేలలు / చల్కా)</option>
                <option value="ALLUVIAL">Alluvial / Riverbed Soil (ఒండ్రు నేలలు)</option>
                <option value="CLAY_LOAM">Clay Loam (బంకమట్టి నేలలు)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Water & Irrigation Source
              </label>
              <select
                value={waterAvailability}
                onChange={(e: any) => setWaterAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
              >
                <option value="BOREWELL">Borewell with Steady Water (బోరుబావి)</option>
                <option value="CANAL_IRRIGATION">Canal Irrigation / Kaleshwaram Command</option>
                <option value="DRIP_IRRIGATION">Drip / Micro-Irrigation (డ్రిప్)</option>
                <option value="RAIN_FED">Rainfed Only (కేవలం వర్షాధారం)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Previous Crop (గతంలో వేసిన పంట)
              </label>
              <input
                type="text"
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                placeholder="e.g. Paddy or Cotton"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-agro-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Analyzing Agro-Climatic Match...</span>
              ) : (
                <>
                  <Sprout className="w-5 h-5" />
                  <span>{t.getRecommendation}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {!results && !loading && (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
              <div className="w-14 h-14 bg-agro-50 text-agro-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-800 text-base">
                Ready for Soil & Climate Analysis
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Select your district, soil type, and water source to receive tailored agronomic advice verified by Telangana agricultural experts.
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Top Recommended Crops ({results.length})
                </h3>
                <span className="text-xs bg-agro-100 text-agro-800 font-bold px-3 py-1 rounded-full">
                  High Suitability Matches
                </span>
              </div>

              {results.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 hover:border-agro-400 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-bold text-agro-700 uppercase tracking-wider block">
                        {rec.crop_telugu_name}
                      </span>
                      <h4 className="text-xl font-extrabold text-gray-900">
                        {rec.recommended_crop}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                        {rec.suitability_score}% Suitability Match
                      </span>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl text-xs">
                    <div>
                      <span className="text-gray-500 block">Expected Yield</span>
                      <span className="font-extrabold text-gray-900">{rec.expected_yield}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Duration</span>
                      <span className="font-extrabold text-gray-900">{rec.duration_days} Days</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Water Need</span>
                      <span className="font-extrabold text-gray-900">{rec.water_requirement}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Est. Profit/Acre</span>
                      <span className="font-extrabold text-agro-700">{rec.estimated_profit_per_acre}</span>
                    </div>
                  </div>

                  {/* Scientific Reasoning */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-800 block">Agronomic Rationale:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {rec.reasoning.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-agro-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Precautions */}
                  {rec.precautions.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Key Precautions:</span>
                      </span>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {rec.precautions.map((p, i) => (
                          <li key={i} className="pl-4 text-gray-600">
                            • {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advisory Notice */}
                  <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-gray-600 flex items-start gap-2">
                    <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <span>{rec.advisory_disclaimer}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
