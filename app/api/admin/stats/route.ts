import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/database/store';

export async function GET() {
  try {
    const stats = globalStore.getAdminStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
