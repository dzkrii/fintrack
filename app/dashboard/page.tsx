import { auth } from '@/auth';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Wallet, TrendingUp, CreditCard, ArrowRightLeft } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || 'User';

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
            Here&apos;s an overview of your finances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value="Rp 0"
            icon={<Wallet className="h-5 w-5" />}
            trend="+0%"
            trendUp={true}
            color="emerald"
          />
          <StatCard
            title="Income"
            value="Rp 0"
            icon={<TrendingUp className="h-5 w-5" />}
            trend="+0%"
            trendUp={true}
            color="blue"
          />
          <StatCard
            title="Expenses"
            value="Rp 0"
            icon={<CreditCard className="h-5 w-5" />}
            trend="-0%"
            trendUp={false}
            color="rose"
          />
          <StatCard
            title="Transfers"
            value="Rp 0"
            icon={<ArrowRightLeft className="h-5 w-5" />}
            trend="0"
            trendUp={true}
            color="violet"
          />
        </div>

        {/* Placeholder Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start tracking your finances!</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Wallets</h3>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Wallet className="h-12 w-12 mb-4 opacity-50" />
              <p>No wallets configured</p>
              <p className="text-sm">Add your first wallet to get started</p>
            </div>
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
  trend: string;
  trendUp: boolean;
  color: 'emerald' | 'blue' | 'rose' | 'violet';
}

function StatCard({ title, value, icon, trend, trendUp, color }: StatCardProps) {
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
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
