import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage') || undefined;
    const category = searchParams.get('category') || undefined;
    const escrowStatus = searchParams.get('escrowStatus') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const batches = await Database.getBatches({
      stage,
      category,
      escrowStatus,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (error: any) {
    console.error('API /api/batches GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchData, aiReport } = body;

    if (!batchData || !batchData.cropName || !batchData.quantityKg || !batchData.basePricePerKg) {
      return NextResponse.json(
        { success: false, error: 'Missing required batch fields (cropName, quantityKg, basePricePerKg)' },
        { status: 400 }
      );
    }

    const newBatch = await Database.createBatch(batchData, aiReport);

    return NextResponse.json(
      {
        success: true,
        message: `Batch ${newBatch.id} registered and minted successfully on Polygon ledger`,
        data: newBatch,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/batches POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create batch' },
      { status: 500 }
    );
  }
}
