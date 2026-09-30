import { NextRequest, NextResponse } from 'next/server';
import { MarketPriceService } from '@/lib/market/marketPriceService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || undefined;
    const crop = searchParams.get('crop') || undefined;

    const result = await MarketPriceService.getLivePrices({ district, crop });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to retrieve mandi prices.' },
      { status: 500 }
    );
  }
}
