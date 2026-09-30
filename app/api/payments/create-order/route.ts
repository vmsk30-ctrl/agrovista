import { NextRequest, NextResponse } from 'next/server';
import { RazorpayPaymentService } from '@/lib/payments/razorpayService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount } = body;

    if (!orderId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid orderId and amount are required.' },
        { status: 400 }
      );
    }

    const orderResult = await RazorpayPaymentService.createOrder({
      orderId,
      amountInRupees: amount,
    });

    return NextResponse.json({
      success: true,
      ...orderResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Payment initiation failed.' },
      { status: 500 }
    );
  }
}
