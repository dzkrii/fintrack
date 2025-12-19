import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/transactions - Fetch all transactions for the authenticated user
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const walletId = searchParams.get('walletId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId: session.user.id };

    if (type && ['INCOME', 'EXPENSE', 'TRANSFER'].includes(type)) {
      where.type = type;
    }

    if (walletId) {
      where.OR = [{ walletId }, { toWalletId: walletId }];
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        wallet: { select: { id: true, name: true, icon: true } },
        toWallet: { select: { id: true, name: true, icon: true } },
        category: { select: { id: true, name: true, icon: true, type: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Serialize Decimal to number for client
    const serialized = transactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toNumber(),
      date: tx.date.toISOString(),
      createdAt: tx.createdAt.toISOString(),
      updatedAt: tx.updatedAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { amount, description, date, type, walletId, toWalletId, categoryId } = body;

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
      where: { id: walletId, userId: userId },
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
        where: { id: toWalletId, userId: userId },
      });

      if (!toWallet) {
        return NextResponse.json(
          { error: 'Destination wallet not found' },
          { status: 404 }
        );
      }
    }

    // For INCOME/EXPENSE, verify category
    if ((type === 'INCOME' || type === 'EXPENSE') && categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId: userId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Create transaction and update wallet balances in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          amount,
          description: description?.trim() || null,
          date: date ? new Date(date) : new Date(),
          type,
          userId: userId,
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

      // Update wallet balances based on transaction type
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

    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
