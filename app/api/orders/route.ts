import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/database/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const farmerId = searchParams.get('farmerId');

    let orders;
    if (customerId) {
      orders = globalStore.getOrdersForCustomer(customerId);
    } else if (farmerId) {
      orders = globalStore.getOrdersForFarmer(farmerId);
    } else {
      orders = globalStore.getAllOrders();
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_id,
      farmer_id,
      items,
      delivery_charge = 40,
      shipping_address,
      delivery_contact_phone,
    } = body;

    if (!items || !items.length || !shipping_address) {
      return NextResponse.json(
        { success: false, message: 'Items and shipping address are required.' },
        { status: 400 }
      );
    }

    const order = globalStore.createOrder({
      customer_id: customer_id || 'c1',
      farmer_id: farmer_id || 'f2',
      items,
      delivery_charge: Number(delivery_charge),
      shipping_address,
      delivery_contact_phone: delivery_contact_phone || '9876543210',
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully.',
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}
