import crypto from 'crypto';
import { UserRole } from '@/types';

interface OTPRecord {
  phone: string;
  role: UserRole;
  otpHash: string;
  attempts: number;
  expiresAt: number;
  lastSentAt: number;
}

// In-memory OTP storage for rapid verification & rate limiting
const otpStore = new Map<string, OTPRecord>();

const COOLDOWN_SECONDS = 60;
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

function hashOTP(phone: string, otp: string): string {
  const secret = process.env.OTP_PROVIDER_SECRET || 'agrovista-telangana-salt-2026';
  return crypto.createHmac('sha256', secret).update(`${phone}:${otp}`).digest('hex');
}

export interface SendOTPResult {
  success: boolean;
  message: string;
  cooldownRemaining?: number;
  sandboxOTP?: string; // Provided in development/sandbox mode for testing
  isSandbox: boolean;
}

export interface VerifyOTPResult {
  success: boolean;
  message: string;
  role?: UserRole;
  attemptsRemaining?: number;
}

export class OTPService {
  /**
   * Generates and dispatches a 6-digit OTP to the Indian mobile number
   */
  public static async sendOTP(phone: string, role: UserRole): Promise<SendOTPResult> {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.', isSandbox: true };
    }

    const now = Date.now();
    const existing = otpStore.get(cleanPhone);

    // Enforce cooldown
    if (existing && now - existing.lastSentAt < COOLDOWN_SECONDS * 1000) {
      const remaining = Math.ceil((COOLDOWN_SECONDS * 1000 - (now - existing.lastSentAt)) / 1000);
      return {
        success: false,
        message: `Please wait ${remaining}s before requesting a new OTP.`,
        cooldownRemaining: remaining,
        isSandbox: !process.env.OTP_PROVIDER_API_KEY,
      };
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOTP(cleanPhone, otp);

    otpStore.set(cleanPhone, {
      phone: cleanPhone,
      role,
      otpHash,
      attempts: 0,
      expiresAt: now + OTP_EXPIRY_MINUTES * 60 * 1000,
      lastSentAt: now,
    });

    const apiKey = process.env.OTP_PROVIDER_API_KEY;

    // If external SMS provider configured (e.g. Fast2SMS, MSG91)
    if (apiKey) {
      try {
        // Indian SMS Gateway Integration Hook
        const smsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: cleanPhone,
          }),
        });

        if (smsResponse.ok) {
          return {
            success: true,
            message: `OTP sent successfully to +91 ${cleanPhone}.`,
            isSandbox: false,
          };
        }
      } catch (err) {
        console.error('External SMS Gateway error, falling back to sandbox mode:', err);
      }
    }

    // Development / Sandbox Fallback
    return {
      success: true,
      message: `[SANDBOX] OTP sent to +91 ${cleanPhone}.`,
      sandboxOTP: otp,
      isSandbox: true,
    };
  }

  /**
   * Validates OTP server-side with max attempts and expiration checks
   */
  public static verifyOTP(phone: string, otpInput: string): VerifyOTPResult {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const record = otpStore.get(cleanPhone);

    if (!record) {
      return { success: false, message: 'No active OTP found. Please request a new OTP.' };
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      otpStore.delete(cleanPhone);
      return { success: false, message: 'OTP has expired. Please request a new OTP.' };
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(cleanPhone);
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a fresh OTP.',
        attemptsRemaining: 0,
      };
    }

    const inputHash = hashOTP(cleanPhone, otpInput.trim());
    if (inputHash !== record.otpHash) {
      record.attempts += 1;
      const remaining = MAX_ATTEMPTS - record.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${remaining} attempt(s) remaining.`,
        attemptsRemaining: remaining,
      };
    }

    // Success: consume OTP immediately so it cannot be reused
    const role = record.role;
    otpStore.delete(cleanPhone);

    return {
      success: true,
      message: 'Mobile verification successful.',
      role,
    };
  }
}
