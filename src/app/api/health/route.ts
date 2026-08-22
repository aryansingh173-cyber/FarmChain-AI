import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';
import { BlockchainService } from '@/server/blockchain';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const health = await Database.getHealth();
    const network = BlockchainService.getNetworkStatus();

    return NextResponse.json({
      success: true,
      ...health,
      blockchain: {
        ...health.blockchain,
        ...network,
      },
    });
  } catch (error: any) {
    console.error('API /api/health GET Error:', error);
    return NextResponse.json(
      { success: false, status: 'error', error: error.message },
      { status: 500 }
    );
  }
}
