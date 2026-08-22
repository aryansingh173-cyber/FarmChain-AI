import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';
import { TelemetryReadingInput } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const batch = await Database.getBatchById(id);

    if (!batch) {
      return NextResponse.json(
        { success: false, error: `Batch "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      telemetry: batch.iotTelemetry || null,
    });
  } catch (error: any) {
    console.error('API /api/batches/[id]/telemetry GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: TelemetryReadingInput = await request.json();

    const updatedBatch = await Database.updateTelemetry(id, body);

    if (!updatedBatch) {
      return NextResponse.json(
        { success: false, error: `Batch "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Telemetry sensor data ingested for batch ${id}`,
      telemetry: updatedBatch.iotTelemetry,
    });
  } catch (error: any) {
    console.error('API /api/batches/[id]/telemetry POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update telemetry' },
      { status: 500 }
    );
  }
}
