import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const stats = await Database.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('API /api/stats GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
