import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let buyerWallet: string | undefined;

    try {
      const body = await request.json();
      buyerWallet = body.buyerWallet;
    } catch {
      // Body is optional
    }

    const result = await Database.releaseEscrow(id, buyerWallet);

    if (!result) {
      return NextResponse.json(
        { success: false, error: `Batch "${id}" not found or escrow already settled` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Escrow funds of ₹${result.settledAmount.toLocaleString('en-IN')} released to farmer for batch ${id}`,
      txHash: result.txHash,
      settledAmountINR: result.settledAmount,
      data: result.batch,
    });
  } catch (error: any) {
    console.error('API /api/batches/[id]/escrow-release POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to release escrow' },
      { status: 500 }
    );
  }
}
