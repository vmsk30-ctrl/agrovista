import {
  User,
  FarmerProfile,
  CustomerProfile,
  Product,
  Order,
  OrderItem,
  Payment,
  Delivery,
  MarketPrice,
  GovernmentScheme,
  WeatherData,
  OrderStatus,
  PaymentStatus,
  Notification,
  Conversation,
  Message,
} from '@/types';
import {
  SEED_FARMERS,
  SEED_CUSTOMERS,
  SEED_PRODUCTS,
  SEED_MARKET_PRICES,
  SEED_GOVERNMENT_SCHEMES,
  SEED_WEATHER_DATA,
} from '@/lib/seedData';

// Global in-memory storage for demo and development fallback
class AgroDataStore {
  private users: User[] = [];
  private farmerProfiles: FarmerProfile[] = [];
  private customerProfiles: CustomerProfile[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private payments: Payment[] = [];
  private deliveries: Delivery[] = [];
  private marketPrices: MarketPrice[] = [];
  private schemes: GovernmentScheme[] = [];
  private notifications: Notification[] = [];
  private conversations: Conversation[] = [];
  private messages: Message[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    // Seed Users and Profiles
    SEED_FARMERS.forEach((f) => {
      const u: User = {
        id: f.user_id,
        name: f.name,
        email: f.email,
        phone: f.phone,
        role: f.role,
        language: f.language,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.users.push(u);

      const fp: FarmerProfile = {
        id: f.id,
        user_id: f.user_id,
        farm_name: f.farm_name,
        village: f.village,
        district: f.district,
        state: f.state,
        pincode: f.pincode,
        farm_size: f.farm_size,
        crops: f.crops,
        verification_status: f.verification_status,
        user: u,
      };
      this.farmerProfiles.push(fp);
    });

    SEED_CUSTOMERS.forEach((c) => {
      const u: User = {
        id: c.user_id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        role: c.role,
        language: 'en',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.users.push(u);

      const cp: CustomerProfile = {
        id: c.id,
        user_id: c.user_id,
        address: c.address,
        city: c.city,
        state: c.state,
        pincode: c.pincode,
        user: u,
      };
      this.customerProfiles.push(cp);
    });

    // Admin & Delivery Partner users
    const adminUser: User = {
      id: "u_admin_1",
      name: "AgroVista Admin",
      email: "admin@agrovista.in",
      phone: "9999999999",
      role: "ADMIN",
      language: "en",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.push(adminUser);

    const deliveryUser: User = {
      id: "u_delivery_1",
      name: "Suresh Telangana Express",
      email: "suresh.delivery@agrovista.in",
      phone: "9888888888",
      role: "DELIVERY_PARTNER",
      language: "te",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.push(deliveryUser);

    this.products = [...SEED_PRODUCTS];
    this.marketPrices = [...SEED_MARKET_PRICES];
    this.schemes = [...SEED_GOVERNMENT_SCHEMES];

    // Seed an initial demo order so customers and farmers can immediately see the lifecycle
    const initialOrder: Order = {
      id: "ord_demo_101",
      customer_id: "c1",
      farmer_id: "f2",
      total_amount: 196,
      delivery_charge: 40,
      payment_status: "PAID",
      order_status: "READY_FOR_PICKUP",
      delivery_status: "ASSIGNED",
      shipping_address: "Flat 402, Sunshine Heights, Madhapur, Hyderabad - 500081",
      delivery_contact_phone: "9876543210",
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      customer: this.customerProfiles[0],
      farmer: this.farmerProfiles[1],
      items: [
        {
          id: "item_1",
          order_id: "ord_demo_101",
          product_id: "p1",
          quantity: 3,
          unit_price: 32,
          subtotal: 96,
          product: this.products[0],
        },
        {
          id: "item_2",
          order_id: "ord_demo_101",
          product_id: "p3",
          quantity: 4,
          unit_price: 25,
          subtotal: 100,
          product: this.products[2],
        },
      ],
      delivery: {
        id: "del_101",
        order_id: "ord_demo_101",
        delivery_partner_id: deliveryUser.id,
        pickup_address: "Green Valley Agro Farm, Shamshabad, Rangareddy",
        delivery_address: "Flat 402, Sunshine Heights, Madhapur, Hyderabad - 500081",
        status: "READY_FOR_PICKUP",
        tracking_reference: "AGRO-DEL-89211",
        estimated_delivery: new Date(Date.now() + 3600000 * 6).toISOString(),
        delivery_partner: deliveryUser,
        history: [
          {
            id: "dh_1",
            delivery_id: "del_101",
            status: "ORDER_PLACED",
            timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
            location: "Customer App",
            note: "Order confirmed & paid via UPI",
          },
          {
            id: "dh_2",
            delivery_id: "del_101",
            status: "FARMER_CONFIRMED",
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
            location: "Shamshabad Farm",
            note: "Farmer Lakshmi Bai accepted order",
          },
          {
            id: "dh_3",
            delivery_id: "del_101",
            status: "READY_FOR_PICKUP",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            location: "Shamshabad Packing Shed",
            note: "Fresh produce harvested and boxed. Assigned to partner Suresh.",
          },
        ],
      },
    };
    this.orders.push(initialOrder);

    // Initial conversation
    this.conversations.push({
      id: "conv_1",
      customer_id: "u_customer_1",
      farmer_id: "u_farmer_2",
      order_id: "ord_demo_101",
      last_message: "Lakshmi garu, please ensure ripe red tomatoes are packed.",
      last_message_at: new Date().toISOString(),
      customer: this.users.find((u) => u.id === "u_customer_1"),
      farmer: this.users.find((u) => u.id === "u_farmer_2"),
    });

    this.messages.push(
      {
        id: "msg_1",
        conversation_id: "conv_1",
        sender_id: "u_customer_1",
        message: "Namaste Lakshmi garu, I have placed order for 3kg tomatoes and fresh palak.",
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: "msg_2",
        conversation_id: "conv_1",
        sender_id: "u_farmer_2",
        message: "Namaste Priya garu! Thank you. I have handpicked the best naturally ripened tomatoes for you this morning.",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    );
  }

  // User Methods
  public findUserByPhone(phone: string): User | undefined {
    return this.users.find((u) => u.phone === phone);
  }

  public findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public createUser(user: Partial<User> & { phone: string; role: User['role'] }): User {
    const existing = this.findUserByPhone(user.phone);
    if (existing) {
      existing.role = user.role;
      return existing;
    }
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: user.name || `User ${user.phone.slice(-4)}`,
      email: user.email || `${user.phone}@agrovista.local`,
      phone: user.phone,
      role: user.role,
      language: user.language || 'en',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.push(newUser);

    if (user.role === 'FARMER') {
      const fp: FarmerProfile = {
        id: `f_${Date.now()}`,
        user_id: newUser.id,
        farm_name: `${newUser.name}'s Farm`,
        village: "Hyderabad Rural",
        district: "Rangareddy",
        state: "Telangana",
        pincode: "501218",
        farm_size: "3.0 Acres",
        crops: ["Vegetables"],
        verification_status: "VERIFIED",
        user: newUser,
      };
      this.farmerProfiles.push(fp);
    } else if (user.role === 'CUSTOMER') {
      const cp: CustomerProfile = {
        id: `c_${Date.now()}`,
        user_id: newUser.id,
        address: "Hyderabad, Telangana",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        user: newUser,
      };
      this.customerProfiles.push(cp);
    }

    return newUser;
  }

  public getFarmerProfile(userId: string): FarmerProfile | undefined {
    return this.farmerProfiles.find((fp) => fp.user_id === userId);
  }

  public getCustomerProfile(userId: string): CustomerProfile | undefined {
    return this.customerProfiles.find((cp) => cp.user_id === userId);
  }

  // Product Methods
  public getProducts(category?: string, search?: string): Product[] {
    let list = this.products.filter((p) => p.status === 'AVAILABLE');
    if (category && category !== 'ALL') {
      list = list.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.crop_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.farmer?.farm_name.toLowerCase().includes(q) ||
          p.farmer?.district.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getFarmerProducts(farmerId: string): Product[] {
    return this.products.filter((p) => p.farmer_id === farmerId);
  }

  public addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const newProd: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.products.unshift(newProd);
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.products[idx] = {
        ...this.products[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return this.products[idx];
    }
    return undefined;
  }

  // Order Methods
  public createOrder(orderData: {
    customer_id: string;
    farmer_id: string;
    items: { product_id: string; quantity: number; unit_price: number }[];
    delivery_charge: number;
    shipping_address: string;
    delivery_contact_phone: string;
  }): Order {
    const subtotal = orderData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const totalAmount = subtotal + orderData.delivery_charge;

    const orderId = `ord_${Date.now()}`;
    const trackingRef = `AGRO-DEL-${Math.floor(10000 + Math.random() * 90000)}`;

    const delivery: Delivery = {
      id: `del_${Date.now()}`,
      order_id: orderId,
      pickup_address: "Local Farmer Collection Yard, Telangana",
      delivery_address: orderData.shipping_address,
      status: "ORDER_PLACED",
      tracking_reference: trackingRef,
      estimated_delivery: new Date(Date.now() + 3600000 * 24).toISOString(),
      history: [
        {
          id: `dh_${Date.now()}`,
          delivery_id: `del_${Date.now()}`,
          status: "ORDER_PLACED",
          timestamp: new Date().toISOString(),
          location: "AgroVista Platform",
          note: "Order placed and payment authorized.",
        },
      ],
    };

    const newOrder: Order = {
      id: orderId,
      customer_id: orderData.customer_id,
      farmer_id: orderData.farmer_id,
      total_amount: totalAmount,
      delivery_charge: orderData.delivery_charge,
      payment_status: "PAID",
      order_status: "ORDER_PLACED",
      delivery_status: "PENDING",
      shipping_address: orderData.shipping_address,
      delivery_contact_phone: orderData.delivery_contact_phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderData.items.map((it, idx) => ({
        id: `oi_${Date.now()}_${idx}`,
        order_id: orderId,
        product_id: it.product_id,
        quantity: it.quantity,
        unit_price: it.unit_price,
        subtotal: it.quantity * it.unit_price,
        product: this.getProductById(it.product_id),
      })),
      delivery,
    };

    this.orders.unshift(newOrder);
    this.deliveries.push(delivery);
    return newOrder;
  }

  public getOrdersForCustomer(customerId: string): Order[] {
    return this.orders.filter((o) => o.customer_id === customerId);
  }

  public getOrdersForFarmer(farmerId: string): Order[] {
    return this.orders.filter((o) => o.farmer_id === farmerId);
  }

  public getAllOrders(): Order[] {
    return this.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, note?: string, location?: string): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.order_status = status;
    order.updated_at = new Date().toISOString();

    if (order.delivery) {
      order.delivery.status = status;
      order.delivery.history = order.delivery.history || [];
      order.delivery.history.push({
        id: `dh_${Date.now()}`,
        delivery_id: order.delivery.id,
        status,
        timestamp: new Date().toISOString(),
        location: location || "Transit Hub",
        note: note || `Status updated to ${status}`,
      });
      if (status === 'PICKED_UP') {
        order.delivery.picked_up_at = new Date().toISOString();
      }
      if (status === 'DELIVERED') {
        order.delivery.delivered_at = new Date().toISOString();
      }
    }

    return order;
  }

  public getAllDeliveries(): Delivery[] {
    return this.deliveries;
  }

  // Market Prices & Schemes
  public getMarketPrices(): MarketPrice[] {
    return this.marketPrices;
  }

  public getSchemes(): GovernmentScheme[] {
    return this.schemes;
  }

  // Admin stats
  public getAdminStats() {
    const totalUsers = this.users.length;
    const farmersCount = this.farmerProfiles.length;
    const customersCount = this.customerProfiles.length;
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter((o) => o.payment_status === 'PAID')
      .reduce((sum, o) => sum + o.total_amount, 0);
    const activeProducts = this.products.filter((p) => p.status === 'AVAILABLE').length;

    return {
      totalUsers,
      farmersCount,
      customersCount,
      totalOrders,
      totalRevenue,
      activeProducts,
    };
  }
}

// Singleton global store instance
export const globalStore = new AgroDataStore();
