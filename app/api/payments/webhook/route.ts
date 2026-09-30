import { NextRequest, NextResponse } from 'next/server';
import { RazorpayPaymentService } from '@/lib/payments/razorpayService';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    const isValid = RazorpayPaymentService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log('Verified Razorpay Webhook Event:', event.event);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ message: 'Webhook processing error' }, { status: 500 });
  }
}
