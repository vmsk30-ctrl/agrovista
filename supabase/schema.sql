-- AGROVISTA PRODUCTION POSTGRESQL DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL
-- Features: Foreign keys, constraints, indexes, Row Level Security (RLS) policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('FARMER', 'CUSTOMER', 'ADMIN', 'DELIVERY_PARTNER')),
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'te')),
    profile_image TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick phone lookup
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. FARMER PROFILES
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) NOT NULL,
    village VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    state VARCHAR(100) DEFAULT 'Telangana',
    pincode VARCHAR(10) NOT NULL,
    farm_size VARCHAR(50) NOT NULL,
    crops TEXT[] DEFAULT '{}',
    verification_status VARCHAR(30) DEFAULT 'VERIFIED' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farmer_user_id ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farmer_district ON farmer_profiles(district);

-- 3. CUSTOMER PROFILES
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(100) DEFAULT 'Telangana',
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_user_id ON customer_profiles(user_id);

-- 4. PRODUCTS (Direct farmer produce listings)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    crop_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('VEGETABLES', 'FRUITS', 'GRAINS', 'PULSES', 'SPICES', 'DAIRY')),
    description TEXT,
    image_url TEXT NOT NULL,
    quantity_available NUMERIC(10, 2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    farmer_price NUMERIC(10, 2) NOT NULL,
    market_reference_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OUT_OF_STOCK', 'ARCHIVED')),
    harvest_date DATE DEFAULT CURRENT_DATE,
    is_organic BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES farmer_profiles(id) ON DELETE RESTRICT,
    total_amount NUMERIC(10, 2) NOT NULL,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    payment_status VARCHAR(30) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    order_status VARCHAR(40) DEFAULT 'ORDER_PLACED' CHECK (order_status IN (
        'ORDER_PLACED', 'FARMER_CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
    )),
    delivery_status VARCHAR(30) DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED')),
    shipping_address TEXT NOT NULL,
    delivery_contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 7. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_gateway VARCHAR(50) NOT NULL,
    gateway_order_id VARCHAR(255) NOT NULL,
    gateway_payment_id VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    paid_at TIMESTAMPTZ,
    signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order ON payments(gateway_order_id);

-- 8. DELIVERIES
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_partner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status VARCHAR(40) DEFAULT 'READY_FOR_PICKUP',
    tracking_reference VARCHAR(100) UNIQUE NOT NULL,
    estimated_delivery TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_partner ON deliveries(delivery_partner_id);

-- 9. DELIVERY STATUS HISTORY
CREATE TABLE IF NOT EXISTS delivery_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    status VARCHAR(40) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    location VARCHAR(255) NOT NULL,
    note TEXT
);

CREATE INDEX IF NOT EXISTS idx_delivery_history_id ON delivery_status_history(delivery_id);

-- 10. MARKET PRICES (Agmarknet & Telangana Marketing Department)
CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Telangana',
    district VARCHAR(100) NOT NULL,
    market VARCHAR(100) NOT NULL,
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'Quintal',
    source VARCHAR(255) DEFAULT 'Agmarknet / Department of Agricultural Marketing, Govt of Telangana',
    source_url TEXT DEFAULT 'https://agmarknet.gov.in',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_prices_crop ON market_prices(crop_name);
CREATE INDEX IF NOT EXISTS idx_market_prices_district ON market_prices(district);

-- 11. MARKET PRICE HISTORY (For charts and AI trend models)
CREATE TABLE IF NOT EXISTS market_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    market VARCHAR(100) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    recorded_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_crop_date ON market_price_history(crop_name, recorded_date);

-- 12. CROP RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS crop_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    crop VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    soil_information JSONB NOT NULL,
    season VARCHAR(50) NOT NULL,
    recommendation JSONB NOT NULL,
    confidence NUMERIC(5, 2) NOT NULL,
    model_version VARCHAR(50) DEFAULT 'AgroVista-Rule-ML-v1.2',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. FERTILIZER GUIDANCE
CREATE TABLE IF NOT EXISTS fertilizer_guidance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(50) NOT NULL,
    soil_condition TEXT,
    nutrient_information TEXT,
    recommendation JSONB NOT NULL,
    source VARCHAR(255) DEFAULT 'PJTSAU (Professor Jayashankar Telangana State Agricultural University)',
    source_url TEXT DEFAULT 'https://pjtsau.edu.in',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. GOVERNMENT SCHEMES
CREATE TABLE IF NOT EXISTS government_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    telugu_name VARCHAR(255),
    description TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    farmer_category TEXT[] DEFAULT '{}',
    applicable_crops TEXT[] DEFAULT '{}',
    eligibility TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    required_documents TEXT[] DEFAULT '{}',
    application_process TEXT[] DEFAULT '{}',
    official_url TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    last_verified DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. WEATHER DATA
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Telangana',
    temperature NUMERIC(5, 2) NOT NULL,
    rainfall NUMERIC(5, 2) NOT NULL,
    humidity NUMERIC(5, 2) NOT NULL,
    forecast JSONB NOT NULL,
    source VARCHAR(255) DEFAULT 'IMD / Open-Meteo Agro API',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

-- 17. CONVERSATIONS & MESSAGES (Order-linked farmer-customer chat)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

-- 18. OTP VERIFICATIONS (For secure server-side verification)
CREATE TABLE IF NOT EXISTS otp_verifications (
    phone VARCHAR(20) PRIMARY KEY,
    otp_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    attempts INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    last_sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public products view" ON products FOR SELECT USING (status = 'AVAILABLE');
CREATE POLICY "Public market prices view" ON market_prices FOR SELECT USING (true);
CREATE POLICY "Public schemes view" ON government_schemes FOR SELECT USING (true);
