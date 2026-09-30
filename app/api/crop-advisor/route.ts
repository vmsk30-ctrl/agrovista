import { NextRequest, NextResponse } from 'next/server';
import { CropAdvisorService } from '@/lib/crop/cropAdvisorService';
import { CropRecommendationInput } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: CropRecommendationInput = await req.json();

    if (!body.soil_type || !body.season || !body.water_availability) {
      return NextResponse.json(
        { success: false, message: 'Soil type, season, and water availability are required.' },
        { status: 400 }
      );
    }

    const recommendations = CropAdvisorService.recommendCrops(body);

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Crop recommendation failed.' },
      { status: 500 }
    );
  }
}
