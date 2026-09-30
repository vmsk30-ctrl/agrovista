// AgroVista TypeScript Types Definition
// Matching PostgreSQL Supabase Schema

export type UserRole = 'FARMER' | 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PARTNER';

export type LanguageCode = 'en' | 'te';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  language: LanguageCode;
  profile_image?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  farm_name: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  farm_size: string; // e.g. "4.5 Acres"
  crops: string[]; // e.g. ["Rice", "Chili", "Cotton"]
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  user?: User;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  user?: User;
}

export type ProductCategory = 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'PULSES' | 'SPICES' | 'DAIRY';

export interface Product {
  id: string;
  farmer_id: string;
  crop_name: string;
  category: ProductCategory;
  description: string;
  image_url: string;
  quantity_available: number;
  unit: 'kg' | 'quintal' | 'bag' | 'crate' | 'dozen';
  farmer_price: number; // Price per unit set by farmer
  market_reference_price: number; // Current mandi reference price
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  harvest_date?: string;
  is_organic?: boolean;
  created_at: string;
  updated_at: string;
  farmer?: FarmerProfile & { user?: User };
}

export type OrderStatus =
  | 'ORDER_PLACED'
  | 'FARMER_CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: Product;
}

export interface Order {
  id: string;
  customer_id: string;
  farmer_id: string;
  total_amount: number;
  delivery_charge: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  delivery_status: DeliveryStatus;
  shipping_address: string;
  delivery_contact_phone: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  customer?: CustomerProfile & { user?: User };
  farmer?: FarmerProfile & { user?: User };
  delivery?: Delivery;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_gateway: 'RAZORPAY' | 'CASHFREE' | 'SANDBOX_UPI';
  gateway_order_id: string;
  gateway_payment_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at?: string;
  signature?: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  delivery_partner_id?: string;
  pickup_address: string;
  delivery_address: string;
  status: OrderStatus;
  tracking_reference: string;
  estimated_delivery: string;
  picked_up_at?: string;
  delivered_at?: string;
  delivery_partner?: User;
  history?: DeliveryStatusHistory[];
}

export interface DeliveryStatusHistory {
  id: string;
  delivery_id: string;
  status: OrderStatus;
  timestamp: string;
  location: string;
  note: string;
}

export interface MarketPrice {
  id: string;
  crop_name: string;
  state: string;
  district: string;
  market: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  source: string;
  source_url: string;
  recorded_at: string;
}

export interface MarketPriceHistory {
  id: string;
  crop_name: string;
  market: string;
  district: string;
  modal_price: number;
  date: string;
}

export interface AIPrediction {
  crop_name: string;
  market: string;
  current_modal_price: number;
  predicted_min_price: number;
  predicted_max_price: number;
  predicted_modal_price: number;
  trend: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  horizon: string; // e.g. "Next 7 days"
  confidence_percentage: number;
  factors: string[];
  disclaimer: string;
  last_updated: string;
}

export interface CropRecommendationInput {
  district: string;
  season: 'KHARIF' | 'RABI' | 'ZAID';
  soil_type: 'BLACK_COTTON' | 'RED_SANDY' | 'ALLUVIAL' | 'LATERITE' | 'CLAY_LOAM';
  water_availability: 'CANAL_IRRIGATION' | 'BOREWELL' | 'RAIN_FED' | 'DRIP_IRRIGATION';
  farm_size_acres: number;
  previous_crop?: string;
}

export interface CropRecommendationOutput {
  id: string;
  recommended_crop: string;
  crop_telugu_name?: string;
  suitability_score: number; // 0-100%
  expected_yield: string;
  duration_days: number;
  water_requirement: 'LOW' | 'MEDIUM' | 'HIGH';
  estimated_profit_per_acre: string;
  reasoning: string[];
  precautions: string[];
  advisory_disclaimer: string;
}

export interface FertilizerGuidance {
  id: string;
  crop: string;
  growth_stage: 'BASAL' | 'VEGETATIVE' | 'FLOWERING' | 'FRUITING' | 'MATURITY';
  soil_condition: string;
  nutrient_deficiency?: string;
  recommended_fertilizers: {
    name: string;
    dosage_per_acre: string;
    application_method: string;
    timing: string;
  }[];
  organic_alternatives: string[];
  precautions: string[];
  source: string;
  source_url: string;
  last_verified: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  telugu_name: string;
  description: string;
  state: string; // "Telangana" or "Central"
  farmer_category: ('SMALL_MARGINAL' | 'ALL' | 'TENANT_FARMERS' | 'WOMEN_FARMERS')[];
  applicable_crops: string[];
  eligibility: string[];
  benefits: string[];
  required_documents: string[];
  application_process: string[];
  official_url: string;
  source: string;
  last_verified: string;
}

export interface WeatherData {
  location: string;
  district: string;
  state: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  rainfall_mm: number;
  wind_speed_kmh: number;
  weather_condition: string;
  icon_type: 'SUNNY' | 'RAINY' | 'CLOUDY' | 'STORMY' | 'PARTLY_CLOUDY';
  forecast: {
    date: string;
    day_name: string;
    temp_max: number;
    temp_min: number;
    condition: string;
    rain_probability: number;
  }[];
  farming_advisory: string;
  alerts: string[];
  source: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'MARKET' | 'SCHEME' | 'WEATHER' | 'SYSTEM';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  customer_id: string;
  farmer_id: string;
  order_id?: string;
  last_message?: string;
  last_message_at: string;
  customer?: User;
  farmer?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface DigitalLiteracyGuide {
  id: string;
  slug: string;
  title: string;
  telugu_title: string;
  summary: string;
  telugu_summary: string;
  category: 'SMARTPHONE' | 'PAYMENTS_UPI' | 'AGROVISTA' | 'ONLINE_SAFETY' | 'GOV_SERVICES';
  icon: string;
  steps: {
    step_number: number;
    instruction: string;
    telugu_instruction: string;
    tip: string;
    warning?: string;
  }[];
}
