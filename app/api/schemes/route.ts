import { NextRequest, NextResponse } from 'next/server';
import { globalStore } from '@/lib/database/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const state = searchParams.get('state');

    let schemes = globalStore.getSchemes();

    if (state && state !== 'ALL') {
      schemes = schemes.filter((s) => s.state.toLowerCase() === state.toLowerCase());
    }

    if (search) {
      schemes = schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.telugu_name.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search) ||
          s.benefits.some((b) => b.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch schemes' },
      { status: 500 }
    );
  }
}
