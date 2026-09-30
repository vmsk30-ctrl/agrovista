import { NextRequest, NextResponse } from 'next/server';
import { OTPService } from '@/lib/auth/otpService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, role } = body;

    if (!phone || !role) {
      return NextResponse.json(
        { success: false, message: 'Phone number and role are required.' },
        { status: 400 }
      );
    }

    const result = await OTPService.sendOTP(phone, role);

    return NextResponse.json(result, { status: result.success ? 200 : 429 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to dispatch OTP.' },
      { status: 500 }
    );
  }
}
