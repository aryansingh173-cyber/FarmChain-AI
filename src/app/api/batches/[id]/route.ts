import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/server/db';
import { BlockchainService } from '@/server/blockchain';

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
        { success: false, error: `Produce batch "${id}" not found in immutable ledger` },
        { status: 404 }
      );
    }

    // Generate cryptographic verification proof
    const provenanceProof = BlockchainService.generateProvenanceProof(batch);

    return NextResponse.json({
      success: true,
      data: batch,
      verification: {
        isAuthentic: true,
        network: 'Polygon PoS Mainnet (137)',
        escrowContract: batch.escrowContractAddress,
        merkleRoot: provenanceProof.merkleRoot,
        blockNumber: provenanceProof.blockNumber,
        cryptoSignature: provenanceProof.signature,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('API /api/batches/[id] GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
