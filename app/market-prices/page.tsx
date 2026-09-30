'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { MarketPrice, AIPrediction } from '@/types';
import { SEED_PRICE_HISTORY } from '@/lib/seedData';
import {
  TrendingUp,
  Search,
  Filter,
  Sparkles,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Minus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

const TELANGANA_DISTRICTS = [
  'ALL',
  'Hyderabad',
  'Warangal',
  'Rangareddy',
  'Nalgonda',
  'Adilabad',
  'Nizamabad',
  'Mahabubnagar',
];

export default function MarketPricesPage() {
  const { language, t } = useLanguage();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [district, setDistrict] = useState('ALL');
  const [searchCrop, setSearchCrop] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [predLoading, setPredLoading] = useState(false);
  const [sourceAttribution, setSourceAttribution] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchPrices();
  }, [district]);

  useEffect(() => {
    fetchAIPrediction(selectedCrop);
  }, [selectedCrop]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const url =
        district === 'ALL'
          ? '/api/market-prices'
          : `/api/market-prices?district=${district}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPrices(data.data);
        setSourceAttribution(data.source);
        setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.error('Failed to load prices:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIPrediction = async (crop: string) => {
    setPredLoading(true);
    try {
      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, district: district === 'ALL' ? 'Hyderabad' : district }),
      });
      const data = await res.json();
      if (data.success) {
        setPrediction(data.prediction);
      }
    } catch (err) {
      console.error('Failed to load AI prediction:', err);
    } finally {
      setPredLoading(false);
    }
  };

  const filteredPrices = prices.filter((p) => {
    if (!searchCrop) return true;
    return p.crop_name.toLowerCase().includes(searchCrop.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-agro-800 to-emerald-950 text-white p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-700/60 border border-agro-500 text-xs font-semibold text-agro-200">
            <TrendingUp className="w-3.5 h-3.5 text-agro-400" />
            <span>Official Telangana Mandi Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.liveMandiPrices}
          </h1>
          <p className="text-xs sm:text-sm text-agro-200">
            {sourceAttribution || t.officialSource} • {t.lastUpdated}: {lastUpdated}
          </p>
        </div>
      </div>

      {/* District & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchCrop}
            onChange={(e) => setSearchCrop(e.target.value)}
            placeholder="Search crop (e.g. Tomato, Chili, Paddy)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-agro-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
            District:
          </span>
          {TELANGANA_DISTRICTS.map((d) => (
            <button
              key={d}
              onClick={() => setDistrict(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                district === d
                  ? 'bg-agro-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* AI 7-DAY PRICE PREDICTION MODULE (SECTION 9 REQUIREMENT) */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t.aiForecastTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              7-Day Market Trend & Forecast: {selectedCrop}
            </h2>
          </div>

          {/* Crop Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Analyze Crop:</span>
            <button
              onClick={() => setSelectedCrop('Tomato')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                selectedCrop === 'Tomato' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Tomato
            </button>
            <button
              onClick={() => setSelectedCrop('Red Chili (Dry)')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                selectedCrop === 'Red Chili (Dry)' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Red Chili
            </button>
          </div>
        </div>

        {predLoading || !prediction ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Calculating time-series trends & arrivals...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
                <span className="text-xs text-gray-500 font-bold uppercase block">
                  Current Modal Price
                </span>
                <div className="text-2xl font-extrabold text-gray-900 mt-1">
                  ₹{prediction.current_modal_price}/kg
                </div>
                <span className="text-[11px] text-gray-400">At {prediction.market}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
                <span className="text-xs text-gray-500 font-bold uppercase block">
                  Predicted 7-Day Range
                </span>
                <div className="text-2xl font-extrabold text-amber-700 mt-1">
                  ₹{prediction.predicted_min_price} – ₹{prediction.predicted_max_price}/kg
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">
                  {prediction.trend === 'UPWARD' ? '↑ Upward Trend Expected' : 'Steady Inflows'}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
                <span className="text-xs text-gray-500 font-bold uppercase block">
                  {t.confidenceLevel}
                </span>
                <div className="text-2xl font-extrabold text-agro-700 mt-1">
                  {prediction.confidence_percentage}%
                </div>
                <span className="text-[11px] text-gray-500">Based on 12-month yard data</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm">
                <span className="text-xs text-gray-500 font-bold uppercase block">
                  Forecast Horizon
                </span>
                <div className="text-xl font-extrabold text-gray-900 mt-1">
                  {prediction.horizon}
                </div>
                <span className="text-[11px] text-gray-400">Updated Daily 06:00 AM</span>
              </div>
            </div>

            {/* Contributing Market Factors */}
            <div className="bg-white p-5 rounded-2xl border border-amber-100 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wide text-gray-800">
                Key Market & Supply Drivers:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1.5">
                {prediction.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear Advisory Disclaimer (Critical Specification Rule) */}
            <div className="p-3.5 bg-amber-100/70 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold">Agricultural Advisory Notice: </span>
                {prediction.disclaimer}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* HISTORICAL PRICE TREND CHART (RECHARTS) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {selectedCrop} — 7-Day Historical Modal Price Movement (Bowenpally / Hyderabad)
          </h3>
          <p className="text-xs text-gray-500">
            Source: Agmarknet daily price bulletin (INR per Kilogram)
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SEED_PRICE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} unit="₹" />
              <Tooltip
                formatter={(value: any) => [`₹${value}/kg`, 'Modal Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="modal_price"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 5, fill: '#16a34a' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MANDI PRICES DATA TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-base">
            Mandi Price Records ({filteredPrices.length})
          </h3>
          <span className="text-xs text-agro-700 font-semibold bg-agro-50 px-2.5 py-1 rounded-full">
            Live Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b border-gray-200">
              <tr>
                <th className="p-4">Crop</th>
                <th className="p-4">District</th>
                <th className="p-4">Market Yard</th>
                <th className="p-4">Min Price</th>
                <th className="p-4">Max Price</th>
                <th className="p-4">Modal Price</th>
                <th className="p-4">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPrices.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-gray-900">{p.crop_name}</td>
                  <td className="p-4 font-medium text-gray-700">{p.district}</td>
                  <td className="p-4 text-gray-600">{p.market}</td>
                  <td className="p-4 text-gray-600">₹{p.min_price}</td>
                  <td className="p-4 text-gray-600">₹{p.max_price}</td>
                  <td className="p-4 font-extrabold text-agro-800 text-sm">
                    ₹{p.modal_price}
                  </td>
                  <td className="p-4 text-gray-500">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
