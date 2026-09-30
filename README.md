# AgroVista: AI-Powered Direct Farmer-to-Consumer Agricultural Marketplace

> **"From Farmers to Families, Directly."**
> A production-quality, responsive full-stack agricultural platform designed for small and marginal farmers in rural India, with special focus on Telangana.

---

## 🌾 Platform Highlights

- **Direct Farmer-to-Consumer Marketplace**: Eliminates traditional commission agents. Farmers list fresh harvests with custom prices pegged higher than mandi rates.
- **Real Mobile OTP Authentication**: Authentic Indian SMS gateway adapter (Fast2SMS/MSG91) with cryptographic SHA-256 OTP hashing, 60s cooldown, rate limiting, and an instant sandbox mode.
- **Agricultural Mandi Price Intelligence**: Daily official mandi price feeds (Bowenpally, Enumamula, Suryapet, Nizamabad, Adilabad) via Agmarknet / Directorate of Agricultural Marketing.
- **AI 7-Day Market Price Prediction**: Forecasts upcoming price ranges, demand trends, and confidence scores based on arrivals and seasonality with clear advisory disclaimers.
- **PJTSAU Scientific Crop Advisor**: Personalized crop matching based on Telangana district, season (Kharif/Rabi/Zaid), soil type, and irrigation source.
- **Authoritative Fertilizer & Nutrient Guidance**: Stage-wise nutrient dosages (Basal, Vegetative, Flowering, Fruiting) backed by Professor Jayashankar Telangana State Agricultural University (PJTSAU).
- **Government Schemes Discovery**: Searchable directory for Rythu Bandhu / Rythu Bharosa, Rythu Bima, PM-KISAN, and TSMIP drip irrigation subsidies with direct official portal links.
- **Real-Time Agro-Weather**: Live weather feeds, 5-day forecasts, and harvesting alerts via Open-Meteo & IMD.
- **End-to-End Online Payments**: Razorpay payment integration with server-side HMAC SHA-256 signature verification and webhook support.
- **Delivery Lifecycle Tracking**: Multi-step visual tracking timeline (`ORDER_PLACED` → `FARMER_CONFIRMED` → `PREPARING` → `READY_FOR_PICKUP` → `PICKED_UP` → `OUT_FOR_DELIVERY` → `DELIVERED`).
- **Telugu + English Accessibility**: Dynamic i18n localization with one-tap language switching (`English | తెలుగు`).
- **Voice Assistance**: Built-in speech synthesis and voice navigation using the Web Speech API with fallback.
- **Rural Digital Literacy Module**: Pictorial step-by-step guides on smartphone usage, UPI QR scanning safety (never enter PIN to receive money!), and scam prevention.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, React 18, Tailwind CSS, Lucide Icons |
| **Data Visualizations** | Recharts (Historical Mandi Price Trends) |
| **Backend & APIs** | Next.js Server Actions & API Routes, Node.js Crypto |
| **Database** | PostgreSQL via Supabase (Schema, RLS, Indexes, Foreign Keys) |
| **Payments** | Razorpay (Server-Side Verification & Sandbox Simulation) |
| **SMS / OTP** | Fast2SMS / Indian Gateway Adapter with SHA-256 Hashing |
| **Deployment Target** | Vercel |

---

## 🏗️ Relational Database Schema (`supabase/schema.sql`)

The database is built on normalized relational principles with Row Level Security (RLS) policies:

1. `users`: Core profile (`id`, `name`, `phone`, `role`, `language`, `is_verified`)
2. `farmer_profiles`: Farm details (`farm_name`, `village`, `district`, `state`, `farm_size`, `crops`, `verification_status`)
3. `customer_profiles`: Shipping info (`address`, `city`, `state`, `pincode`)
4. `products`: Produce listings (`farmer_id`, `crop_name`, `category`, `farmer_price`, `market_reference_price`, `quantity_available`, `unit`)
5. `orders`: Orders (`customer_id`, `farmer_id`, `total_amount`, `payment_status`, `order_status`, `delivery_status`)
6. `order_items`: Order line items (`order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`)
7. `payments`: Payment records (`gateway_order_id`, `gateway_payment_id`, `amount`, `status`, `signature`)
8. `deliveries`: Dispatches (`tracking_reference`, `pickup_address`, `delivery_address`, `status`, `estimated_delivery`)
9. `delivery_status_history`: Audit trail of parcel transitions
10. `market_prices`: Daily Agmarknet records
11. `market_price_history`: Historical price records for charts and predictions
12. `crop_recommendations`: Farm advisory inputs and outputs
13. `fertilizer_guidance`: Scientific fertilizer schedules
14. `government_schemes`: Welfare schemes and eligibility criteria
15. `weather_data`: Temperature, rainfall, humidity, and agro-advisories
16. `notifications` & `conversations`: Order-linked chats and alerts

---

## 🚀 Quick Start & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/agrovista.git
cd agrovista
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demonstration Flow (Evaluator Walkthrough)

1. **Homepage**: Visit `/` to see the value proposition, live mandi price ticker, and how AgroVista works.
2. **Role Switcher**: Click the top-right profile badge to switch between:
   - 🌾 **Farmer (Lakshmi Bai)** → Go to `/farmer` to view earnings, list new produce, or confirm customer orders.
   - 🛒 **Customer (Priya Sharma)** → Go to `/marketplace` to browse fresh produce, add to cart, and checkout at `/customer/cart`.
   - 🚚 **Delivery Partner (Suresh Express)** → Go to `/delivery` to inspect farm pickups and update status (`PICKED_UP` → `OUT_FOR_DELIVERY` → `DELIVERED`).
   - 🛡️ **State Admin** → Go to `/admin` to review system-wide analytics, orders, and farmer registries.
3. **Mandi Prices & AI Forecast**: Visit `/market-prices` to filter Telangana yards and view the 7-day AI forecast.
4. **Crop Advisor**: Visit `/crop-advisor` to enter soil type, season, and irrigation resources.
5. **PJTSAU Fertilizer Guide**: Visit `/fertilizer` for growth-stage nutrient dosages.
6. **Govt Schemes**: Visit `/schemes` for Rythu Bandhu and subsidy portals.
7. **Digital Literacy**: Visit `/digital-literacy` for rural smartphone and UPI safety tutorials.

---

## ☁️ Vercel & Supabase Deployment Guide

### 1. Setup Supabase PostgreSQL
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase project.
3. Open `supabase/schema.sql` from this repository and run the SQL query to create all tables, indexes, and RLS policies.
4. Copy your `Project URL`, `anon public key`, and `service_role key` from **Project Settings > API**.

### 2. Deploy to Vercel
1. Push your repository to GitHub.
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID` (or use test sandbox key)
   - `RAZORPAY_KEY_SECRET`
   - `DEMO_MODE=true`
5. Click **Deploy**. Vercel will build and deploy the Next.js App Router project automatically.

---

## 🔒 Security & Best Practices

- **Zero Secrets in Frontend**: All payment secret keys, webhook secrets, and database service keys are restricted to server-side environments.
- **Server-Side Payment Verification**: Order status is NEVER updated from frontend callback data; Razorpay HMAC SHA-256 signatures are validated on the server.
- **OTP Safeguards**: Enforces 60-second cooldowns, rate limits, and a maximum of 3 verification attempts per session.
- **Advisory Disclaimers**: AI price forecasts and crop recommendations clearly state advisory status.

---

## 📜 License
Developed with care for rural empowerment and agricultural digital inclusion.
