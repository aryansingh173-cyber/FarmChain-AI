import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';
import { BatchStage } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { stage, location, notes, verifiedBy } = body;

    if (!stage) {
      return NextResponse.json(
        { success: false, error: 'Missing required field "stage"' },
        { status: 400 }
      );
    }

    const updatedBatch = await Database.addCheckpoint(
      id,
      stage as BatchStage,
      location || 'Transit Corridor Point',
      notes,
      verifiedBy
    );

    if (!updatedBatch) {
      return NextResponse.json(
        { success: false, error: `Batch "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Batch "${id}" progressed to ${stage}`,
      data: updatedBatch,
    });
  } catch (error: any) {
    console.error('API /api/batches/[id]/checkpoints POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
