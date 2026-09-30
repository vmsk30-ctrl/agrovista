import { NextRequest, NextResponse } from 'next/server';
import { RazorpayPaymentService } from '@/lib/payments/razorpayService';
import { globalStore } from '@/lib/database/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = body;

    // Verify HMAC-SHA256 signature server side
    const verification = RazorpayPaymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!verification.isValid) {
      return NextResponse.json(
        { success: false, message: verification.message },
        { status: 400 }
      );
    }

    // Update order status in store
    if (order_id) {
      const order = globalStore.getOrderById(order_id);
      if (order) {
        order.payment_status = 'PAID';
        order.order_status = 'ORDER_PLACED';
        order.updated_at = new Date().toISOString();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and confirmed by server.',
      payment_id: razorpay_payment_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
