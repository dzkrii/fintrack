import LoginForm from '@/components/auth/login-form';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-4">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fintrack</h1>
          <p className="text-zinc-400">Personal Finance Tracker</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-zinc-400 text-sm">Sign in to continue managing your finances</p>
          </div>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          Your personal finance companion
        </p>
      </div>
    </main>
  );
}
