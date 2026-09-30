import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/database/store';
import { OrderStatus } from '@/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await req.json();
    const { status, note, location } = body;

    const validStatuses: OrderStatus[] = [
      'ORDER_PLACED',
      'FARMER_CONFIRMED',
      'PREPARING',
      'READY_FOR_PICKUP',
      'PICKED_UP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order status specified.' },
        { status: 400 }
      );
    }

    const updated = globalStore.updateOrderStatus(orderId, status, note, location);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order status advanced to ${status}`,
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Status update failed.' },
      { status: 500 }
    );
  }
}
