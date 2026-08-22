import { NextRequest, NextResponse } from 'next/server';
import { AIScannerService } from '@/server/ai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cropName, category, imageDataUri, presetIndex } = body;

    const report = await AIScannerService.analyzeCrop({
      cropName,
      category,
      imageDataUri,
      presetIndex,
    });

    return NextResponse.json({
      success: true,
      message: `Crop analysis completed by ${report.modelVersion}`,
      data: report,
    });
  } catch (error: any) {
    console.error('API /api/ai/grade POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'AI Inspection Failed' },
      { status: 500 }
    );
  }
}
