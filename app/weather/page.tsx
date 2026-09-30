'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { WeatherData } from '@/types';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  Calendar,
  CloudRain,
  Sun,
  ShieldCheck,
} from 'lucide-react';

const TELANGANA_DISTRICTS = [
  'Hyderabad',
  'Rangareddy',
  'Warangal',
  'Nalgonda',
  'Karimnagar',
  'Khammam',
];

export default function WeatherPage() {
  const { language, t } = useLanguage();
  const [district, setDistrict] = useState('Rangareddy');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, [district]);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?district=${district}`);
      const data = await res.json();
      if (data.weather) {
        setWeather(data.weather);
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 to-agro-950 text-white p-6 sm:p-10 rounded-3xl shadow-lg">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800/60 border border-sky-600 text-xs font-semibold text-sky-200">
            <CloudSun className="w-3.5 h-3.5 text-sky-400" />
            <span>Agro-Meteorological Advisory Service</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.weatherTitle}
          </h1>
          <p className="text-xs sm:text-sm text-sky-200">
            {t.weatherSub}
          </p>
        </div>
      </div>

      {/* District Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
          District Command Zone:
        </span>
        {TELANGANA_DISTRICTS.map((d) => (
          <button
            key={d}
            onClick={() => setDistrict(d)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              district === d
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading || !weather ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">{t.loading}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Weather Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                  {weather.district}, {weather.state}
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
                  {weather.temperature}°C
                </h2>
                <p className="text-sm font-semibold text-gray-600">
                  {weather.weather_condition} • Feels like {weather.feels_like}°C
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>{t.humidity}: {weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span>Rain: {weather.rainfall_mm} mm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span>{t.windSpeed}: {weather.wind_speed_kmh} km/h</span>
                </div>
              </div>
            </div>

            {/* Farming Advisory Today */}
            <div className="bg-agro-50 p-5 rounded-2xl border border-agro-200 space-y-1.5">
              <div className="flex items-center gap-2 text-agro-900 font-bold text-xs uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-agro-600" />
                <span>{t.farmingAdvisory}</span>
              </div>
              <p className="text-xs sm:text-sm text-agro-950 leading-relaxed font-medium">
                {weather.farming_advisory}
              </p>
            </div>

            {/* Weather Alerts if present */}
            {weather.alerts && weather.alerts.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Agro-Alert: </span>
                  {weather.alerts.join(' • ')}
                </div>
              </div>
            )}
          </div>

          {/* 5-Day Forecast Grid */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              5-Day Agro-Weather Outlook
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weather.forecast.map((f, i) => (
                <div
                  key={i}
                  className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center space-y-2"
                >
                  <span className="text-xs font-bold text-gray-800 block">
                    {f.day_name}
                  </span>
                  <div className="text-lg font-extrabold text-gray-900">
                    {f.temp_max}° / {f.temp_min}°
                  </div>
                  <span className="text-[11px] text-gray-500 block truncate">
                    {f.condition}
                  </span>
                  <div className="text-[10px] text-blue-600 font-bold">
                    {f.rain_probability}% Rain
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
