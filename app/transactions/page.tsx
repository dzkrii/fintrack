import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { TransactionsProvider } from './_components/transactions-context';
import { TransactionsPrimaryButtons } from './_components/transactions-primary-buttons';
import { TransactionsFilters } from './_components/transactions-filters';
import { TransactionsTable } from './_components/transactions-table';
import { TransactionsDialogs } from './_components/transactions-dialogs';

async function getTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      wallet: { select: { id: true, name: true, icon: true } },
      toWallet: { select: { id: true, name: true, icon: true } },
      category: { select: { id: true, name: true, icon: true, type: true } },
    },
    orderBy: { date: 'desc' },
  });

  // Serialize Decimal and Date for client
  return transactions.map((tx) => ({
    ...tx,
    amount: tx.amount.toNumber(),
    date: tx.date.toISOString(),
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  }));
}

async function getWallets(userId: string) {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
    select: { id: true, name: true, icon: true },
    orderBy: { name: 'asc' },
  });
  return wallets;
}

async function getCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true, icon: true, type: true },
    orderBy: { name: 'asc' },
  });
  return categories;
}

export default async function TransactionsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const [transactions, wallets, categories] = await Promise.all([
    getTransactions(userId),
    getWallets(userId),
    getCategories(userId),
  ]);

  return (
    <TransactionsProvider
      initialTransactions={transactions}
      wallets={wallets}
      categories={categories}
    >
      <Header fixed>
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Transactions</h1>
          <TransactionsPrimaryButtons />
        </div>
      </Header>
      <Main>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Track your income, expenses, and transfers across all your wallets.
          </p>
        </div>
        <TransactionsFilters />
        <TransactionsTable />
        <TransactionsDialogs />
      </Main>
    </TransactionsProvider>
  );
}
