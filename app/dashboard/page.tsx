import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Wallet, TrendingUp, CreditCard, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

// Get the current month's date range
function getCurrentMonthRange() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
}

// Get the previous month's date range for trend comparison
function getPreviousMonthRange() {
  const now = new Date();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { startOfPrevMonth, endOfPrevMonth };
}

// Format currency in IDR
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculate trend percentage
function calculateTrend(current: number, previous: number): { value: string; isUp: boolean } {
  if (previous === 0) {
    return { value: current > 0 ? '+100%' : '0%', isUp: current >= 0 };
  }
  const change = ((current - previous) / previous) * 100;
  const isUp = change >= 0;
  return {
    value: `${isUp ? '+' : ''}${change.toFixed(0)}%`,
    isUp,
  };
}

// Format date for display
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

async function getDashboardData(userId: string) {
  const { startOfMonth, endOfMonth } = getCurrentMonthRange();
  const { startOfPrevMonth, endOfPrevMonth } = getPreviousMonthRange();

  // Get total balance from all wallets
  const walletsResult = await prisma.wallet.aggregate({
    where: { userId },
    _sum: { balance: true },
  });
  const totalBalance = walletsResult._sum.balance?.toNumber() || 0;

  // Get current month's income
  const currentIncomeResult = await prisma.transaction.aggregate({
    where: {
      userId,
      type: 'INCOME',
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  });
  const currentIncome = currentIncomeResult._sum.amount?.toNumber() || 0;

  // Get previous month's income for trend
  const prevIncomeResult = await prisma.transaction.aggregate({
    where: {
      userId,
      type: 'INCOME',
      date: { gte: startOfPrevMonth, lte: endOfPrevMonth },
    },
    _sum: { amount: true },
  });
  const prevIncome = prevIncomeResult._sum.amount?.toNumber() || 0;

  // Get current month's expenses
  const currentExpenseResult = await prisma.transaction.aggregate({
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  });
  const currentExpense = currentExpenseResult._sum.amount?.toNumber() || 0;

  // Get previous month's expenses for trend
  const prevExpenseResult = await prisma.transaction.aggregate({
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: startOfPrevMonth, lte: endOfPrevMonth },
    },
    _sum: { amount: true },
  });
  const prevExpense = prevExpenseResult._sum.amount?.toNumber() || 0;

  // Get current month's transfers count
  const currentTransferCount = await prisma.transaction.count({
    where: {
      userId,
      type: 'TRANSFER',
      date: { gte: startOfMonth, lte: endOfMonth },
    },
  });

  // Get previous month's transfers count for trend
  const prevTransferCount = await prisma.transaction.count({
    where: {
      userId,
      type: 'TRANSFER',
      date: { gte: startOfPrevMonth, lte: endOfPrevMonth },
    },
  });

  // Get recent transactions (last 5)
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      wallet: { select: { name: true, icon: true } },
      toWallet: { select: { name: true, icon: true } },
      category: { select: { name: true, icon: true } },
    },
    orderBy: { date: 'desc' },
    take: 5,
  });

  // Get all wallets with balances
  const wallets = await prisma.wallet.findMany({
    where: { userId },
    orderBy: { balance: 'desc' },
    take: 5,
  });

  return {
    totalBalance,
    currentIncome,
    currentExpense,
    currentTransferCount,
    incomeTrend: calculateTrend(currentIncome, prevIncome),
    expenseTrend: calculateTrend(currentExpense, prevExpense),
    transferTrend: calculateTrend(currentTransferCount, prevTransferCount),
    recentTransactions: recentTransactions.map((tx) => ({
      ...tx,
      amount: tx.amount.toNumber(),
      date: tx.date,
    })),
    wallets: wallets.map((w) => ({
      ...w,
      balance: w.balance.toNumber(),
    })),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.name || 'User';

  if (!userId) {
    return null;
  }

  const data = await getDashboardData(userId);

  return (
    <>
      <Header fixed>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </Header>
      <Main>
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Good {getGreeting()}, {userName}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your finances this month
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value={formatCurrency(data.totalBalance)}
            icon={<Wallet className="h-5 w-5" />}
            subtitle="Across all wallets"
            color="emerald"
          />
          <StatCard
            title="Income"
            value={formatCurrency(data.currentIncome)}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={data.incomeTrend.value}
            trendUp={data.incomeTrend.isUp}
            subtitle="This month"
            color="blue"
          />
          <StatCard
            title="Expenses"
            value={formatCurrency(data.currentExpense)}
            icon={<CreditCard className="h-5 w-5" />}
            trend={data.expenseTrend.value}
            trendUp={!data.expenseTrend.isUp}
            subtitle="This month"
            color="rose"
          />
          <StatCard
            title="Transfers"
            value={String(data.currentTransferCount)}
            icon={<ArrowRightLeft className="h-5 w-5" />}
            trend={data.transferTrend.value}
            trendUp={data.transferTrend.isUp}
            subtitle="This month"
            color="violet"
          />
        </div>

        {/* Recent Transactions & Wallets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Link
                href="/transactions"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            {data.recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <CreditCard className="h-12 w-12 mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Start tracking your finances!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          tx.type === 'INCOME'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : tx.type === 'EXPENSE'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {tx.type === 'INCOME' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : tx.type === 'EXPENSE' ? (
                          <CreditCard className="h-4 w-4" />
                        ) : (
                          <ArrowRightLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {tx.description || tx.category?.name || 'Transfer'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.wallet.name} • {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium ${
                        tx.type === 'INCOME'
                          ? 'text-emerald-500'
                          : tx.type === 'EXPENSE'
                          ? 'text-rose-500'
                          : 'text-blue-500'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wallets */}
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Wallets</h3>
              <Link
                href="/wallets"
                className="text-sm text-primary hover:underline"
              >
                Manage
              </Link>
            </div>
            {data.wallets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Wallet className="h-12 w-12 mb-4 opacity-50" />
                <p>No wallets configured</p>
                <p className="text-sm">Add your first wallet to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon || '💳'}</span>
                      <span className="font-medium">{wallet.name}</span>
                    </div>
                    <span className="font-mono font-medium">
                      {formatCurrency(wallet.balance)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  color: 'emerald' | 'blue' | 'rose' | 'violet';
}

function StatCard({ title, value, icon, trend, trendUp, subtitle, color }: StatCardProps) {
  const colorClasses = {
    emerald: 'border-emerald-500/30',
    blue: 'border-blue-500/30',
    rose: 'border-rose-500/30',
    violet: 'border-violet-500/30',
  };

  const iconClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500',
    blue: 'bg-blue-500/10 text-blue-500',
    rose: 'bg-rose-500/10 text-rose-500',
    violet: 'bg-violet-500/10 text-violet-500',
  };

  return (
    <div className={`rounded-xl border bg-card p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-lg ${iconClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-2xl font-bold">{value}</span>
        <div className="flex items-center gap-2">
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
          {trend && (
            <span className={`text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
