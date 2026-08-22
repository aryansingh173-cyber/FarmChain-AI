import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let customBatches;
    try {
      const body = await request.json();
      customBatches = body.batches;
    } catch {
      // Empty body is okay, resets to default INITIAL_BATCHES
    }

    const resetBatches = await Database.seedDatabase(customBatches);

    return NextResponse.json({
      success: true,
      message: 'Database re-seeded successfully to default state',
      count: resetBatches.length,
      data: resetBatches,
    });
  } catch (error: any) {
    console.error('API /api/seed POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}
