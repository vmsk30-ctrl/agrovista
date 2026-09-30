import { NextRequest, NextResponse } from 'next/server';
import { WeatherService } from '@/lib/weather/weatherService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || 'Hyderabad';

    const weather = await WeatherService.getWeatherData(district);

    return NextResponse.json({
      success: true,
      weather,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch weather' },
      { status: 500 }
    );
  }
}
