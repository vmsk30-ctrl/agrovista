'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/cart/CartContext';
import { Product, ProductCategory } from '@/types';
import {
  Search,
  Filter,
  ShoppingCart,
  Check,
  MapPin,
  TrendingDown,
  Sparkles,
  Leaf,
  Plus,
  Minus,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CATEGORIES: { label: string; teluguLabel: string; value: string }[] = [
  { label: 'All Produce', teluguLabel: 'అన్ని పంటలు', value: 'ALL' },
  { label: 'Vegetables', teluguLabel: 'కూరగాయలు', value: 'VEGETABLES' },
  { label: 'Spices', teluguLabel: 'మసాలాలు', value: 'SPICES' },
  { label: 'Fruits', teluguLabel: 'పండ్లు', value: 'FRUITS' },
  { label: 'Grains & Rice', teluguLabel: 'బియ్యం & ధాన్యాలు', value: 'GRAINS' },
];

export default function MarketplacePage() {
  const { language, t } = useLanguage();
  const { addItem, items, updateQuantity } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [addedPopup, setAddedPopup] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory === 'ALL'
          ? '/api/products'
          : `/api/products?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedPopup(product.id);
    setTimeout(() => setAddedPopup(null), 1500);
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.crop_name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.farmer?.farm_name.toLowerCase().includes(q) ||
      p.farmer?.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-agro-700 via-agro-800 to-agro-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-600/60 border border-agro-500 text-xs font-semibold text-agro-100">
            <Leaf className="w-3.5 h-3.5 text-agro-300" />
            <span>
              {language === 'te'
                ? 'రైతుల నుండి ప్రత్యక్షంగా - ఎలాంటి దళారీలు లేరు'
                : '100% Direct From Telangana Farms'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'te' ? 'ఆగ్రోవిస్టా రైతు బజార్' : 'AgroVista Direct Marketplace'}
          </h1>
          <p className="text-sm sm:text-base text-agro-200">
            {language === 'te'
              ? 'గ్రామీణ రైతులు నిర్ణయించిన సరసమైన ధరలకు తాజాగా కోసిన కూరగాయలు, నాటు టమాటాలు, బియ్యం మరియు సుగంధ ద్రవ్యాలు.'
              : 'Direct-from-farm produce harvested fresh every morning. Pay fair prices to farmers and receive farm-fresh goods at your doorstep.'}
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-agro-500 focus:border-agro-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-agro-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language === 'te' ? cat.teluguLabel : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-agro-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">{t.loading}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <p className="text-gray-500 text-sm">{t.noData}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const inCart = items.find((i) => i.product.id === product.id);
            const savings = product.market_reference_price - product.farmer_price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.crop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.is_organic && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{t.organic}</span>
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Farmer & Location Info */}
                    <div className="flex items-center gap-1.5 text-xs text-agro-700 font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {product.farmer?.farm_name || 'Telangana Farm'} •{' '}
                        {product.farmer?.district || 'Warangal'}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {product.crop_name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-gray-400 block">
                          {t.farmerPrice}:
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-extrabold text-agro-800">
                            {formatCurrency(product.farmer_price)}
                          </span>
                          <span className="text-xs text-gray-500">
                            / {product.unit}
                          </span>
                        </div>
                      </div>

                      {product.market_reference_price > product.farmer_price && (
                        <div className="text-right">
                          <span className="text-[11px] text-gray-400 line-through block">
                            Market ₹{product.market_reference_price}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                            Save ₹{savings}/{product.unit}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stock status */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>
                        {product.quantity_available} {product.unit} {t.inStock}
                      </span>
                      <span className="text-agro-700 font-medium">
                        ✓ Harvested {product.harvest_date || 'Today'}
                      </span>
                    </div>

                    {/* Cart Button / Quantity Controller */}
                    {inCart ? (
                      <div className="flex items-center justify-between bg-agro-50 p-1.5 rounded-2xl border border-agro-200">
                        <button
                          onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
                          className="w-9 h-9 rounded-xl bg-white border border-agro-300 text-agro-800 flex items-center justify-center hover:bg-agro-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-extrabold text-agro-900 text-sm">
                          {inCart.quantity} {product.unit} in Cart
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                          className="w-9 h-9 rounded-xl bg-agro-600 text-white flex items-center justify-center hover:bg-agro-700 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                          addedPopup === product.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-agro-600 hover:bg-agro-700 text-white'
                        }`}
                      >
                        {addedPopup === product.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>{t.addToCart}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
