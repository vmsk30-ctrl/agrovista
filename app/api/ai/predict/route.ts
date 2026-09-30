import { NextRequest, NextResponse } from 'next/server';
import { PricePredictionService } from '@/lib/ai/pricePredictionService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { crop, district } = body;

    if (!crop) {
      return NextResponse.json(
        { success: false, message: 'Crop parameter is required.' },
        { status: 400 }
      );
    }

    const prediction = await PricePredictionService.predictPrice(crop, district || 'Hyderabad');

    return NextResponse.json({
      success: true,
      prediction,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Prediction failed.' },
      { status: 500 }
    );
  }
}
