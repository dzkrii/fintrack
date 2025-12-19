import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT /api/wallets/[id] - Update a wallet
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, balance } = body;

    // Verify the wallet belongs to the user
    const existingWallet = await prisma.wallet.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingWallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Wallet name is required' },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.update({
      where: { id },
      data: {
        name: name.trim(),
        icon: icon || null,
        balance: balance !== undefined ? balance : existingWallet.balance,
      },
    });

    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error updating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to update wallet' },
      { status: 500 }
    );
  }
}

// DELETE /api/wallets/[id] - Delete a wallet
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the wallet belongs to the user
    const existingWallet = await prisma.wallet.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingWallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // Check if wallet has transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        OR: [{ walletId: id }, { toWalletId: id }],
      },
    });

    if (transactionCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete wallet with ${transactionCount} associated transactions. Please delete or move transactions first.`,
        },
        { status: 400 }
      );
    }

    await prisma.wallet.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to delete wallet' },
      { status: 500 }
    );
  }
}
