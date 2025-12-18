import { auth } from '@/auth';
import { LogoutButton } from '@/components/auth/logout-button';
import { Wallet, TrendingUp, CreditCard, ArrowRightLeft } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700/50 backdrop-blur-sm bg-zinc-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Fintrack</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm">Welcome back,</span>
              <span className="text-white font-medium">{userName}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Good {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-zinc-400">
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
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <CreditCard className="h-12 w-12 mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start tracking your finances!</p>
            </div>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Wallets</h2>
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Wallet className="h-12 w-12 mb-4 opacity-50" />
              <p>No wallets configured</p>
              <p className="text-sm">Add your first wallet to get started</p>
            </div>
          </div>
        </div>
      </main>
    </div>
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
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    rose: 'from-rose-500/20 to-rose-600/20 border-rose-500/30 text-rose-400',
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
  };

  const iconClasses = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/20 text-blue-400',
    rose: 'bg-rose-500/20 text-rose-400',
    violet: 'bg-violet-500/20 text-violet-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${iconClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className={`text-sm font-medium ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}
