import { NextRequest, NextResponse } from 'next/server';
import { OTPService } from '@/lib/auth/otpService';
import { globalStore } from '@/lib/database/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, name } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone and OTP are required.' },
        { status: 400 }
      );
    }

    const verification = OTPService.verifyOTP(phone, otp);

    if (!verification.success) {
      return NextResponse.json(verification, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const role = verification.role || 'CUSTOMER';

    // Retrieve or register user in store
    const user = globalStore.createUser({
      phone: cleanPhone,
      name: name || (role === 'FARMER' ? 'Telangana Farmer' : 'Agro Consumer'),
      role,
      language: role === 'FARMER' ? 'te' : 'en',
    });

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'OTP verification failed.' },
      { status: 500 }
    );
  }
}
