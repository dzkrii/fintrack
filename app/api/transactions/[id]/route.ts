import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT /api/transactions/[id] - Update a transaction
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { amount, description, date, type, walletId, toWalletId, categoryId } = body;

    // Verify the transaction belongs to the user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (!type || !['INCOME', 'EXPENSE', 'TRANSFER'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    if (!walletId) {
      return NextResponse.json(
        { error: 'Wallet is required' },
        { status: 400 }
      );
    }

    // Verify wallet belongs to user
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // For TRANSFER, verify destination wallet
    if (type === 'TRANSFER') {
      if (!toWalletId) {
        return NextResponse.json(
          { error: 'Destination wallet is required for transfers' },
          { status: 400 }
        );
      }

      if (walletId === toWalletId) {
        return NextResponse.json(
          { error: 'Source and destination wallets must be different' },
          { status: 400 }
        );
      }

      const toWallet = await prisma.wallet.findFirst({
        where: { id: toWalletId, userId: session.user.id },
      });

      if (!toWallet) {
        return NextResponse.json(
          { error: 'Destination wallet not found' },
          { status: 404 }
        );
      }
    }

    // Update transaction and adjust wallet balances in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // First, reverse the original transaction's effect on balances
      const oldType = existingTransaction.type;
      const oldAmount = existingTransaction.amount.toNumber();
      const oldWalletId = existingTransaction.walletId;
      const oldToWalletId = existingTransaction.toWalletId;

      if (oldType === 'INCOME') {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { decrement: oldAmount } },
        });
      } else if (oldType === 'EXPENSE') {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { increment: oldAmount } },
        });
      } else if (oldType === 'TRANSFER' && oldToWalletId) {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { increment: oldAmount } },
        });
        await tx.wallet.update({
          where: { id: oldToWalletId },
          data: { balance: { decrement: oldAmount } },
        });
      }

      // Update the transaction
      const transaction = await tx.transaction.update({
        where: { id },
        data: {
          amount,
          description: description?.trim() || null,
          date: date ? new Date(date) : existingTransaction.date,
          type,
          walletId,
          toWalletId: type === 'TRANSFER' ? toWalletId : null,
          categoryId: type !== 'TRANSFER' ? categoryId : null,
        },
        include: {
          wallet: { select: { id: true, name: true, icon: true } },
          toWallet: { select: { id: true, name: true, icon: true } },
          category: { select: { id: true, name: true, icon: true, type: true } },
        },
      });

      // Apply the new transaction's effect on balances
      if (type === 'INCOME') {
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { increment: amount } },
        });
      } else if (type === 'EXPENSE') {
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { decrement: amount } },
        });
      } else if (type === 'TRANSFER') {
        await tx.wallet.update({
          where: { id: walletId },
          data: { balance: { decrement: amount } },
        });
        await tx.wallet.update({
          where: { id: toWalletId },
          data: { balance: { increment: amount } },
        });
      }

      return transaction;
    });

    // Serialize for response
    const serialized = {
      ...result,
      amount: result.amount.toNumber(),
      date: result.date.toISOString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Delete a transaction
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify the transaction belongs to the user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Delete transaction and reverse wallet balance changes
    await prisma.$transaction(async (tx) => {
      const oldType = existingTransaction.type;
      const oldAmount = existingTransaction.amount.toNumber();
      const oldWalletId = existingTransaction.walletId;
      const oldToWalletId = existingTransaction.toWalletId;

      // Reverse the transaction's effect on balances
      if (oldType === 'INCOME') {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { decrement: oldAmount } },
        });
      } else if (oldType === 'EXPENSE') {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { increment: oldAmount } },
        });
      } else if (oldType === 'TRANSFER' && oldToWalletId) {
        await tx.wallet.update({
          where: { id: oldWalletId },
          data: { balance: { increment: oldAmount } },
        });
        await tx.wallet.update({
          where: { id: oldToWalletId },
          data: { balance: { decrement: oldAmount } },
        });
      }

      // Delete the transaction
      await tx.transaction.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
