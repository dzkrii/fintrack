'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { AtSign, Key, LogIn, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5">
      {/* Username Field */}
      <div className="space-y-2">
        <label 
          className="text-sm font-medium text-zinc-300" 
          htmlFor="username"
        >
          Username
        </label>
        <div className="relative group">
          <input
            className="flex h-12 w-full rounded-xl border border-zinc-600/50 bg-zinc-700/50 px-4 pl-11 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            id="username"
            type="text"
            name="username"
            placeholder="Enter your username"
            required
            disabled={isPending}
          />
          <AtSign className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label 
          className="text-sm font-medium text-zinc-300" 
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative group">
          <input
            className="flex h-12 w-full rounded-xl border border-zinc-600/50 bg-zinc-700/50 px-4 pl-11 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            minLength={6}
            disabled={isPending}
          />
          <Key className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div 
          className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
          aria-live="polite"
          aria-atomic="true"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign in
          </>
        )}
      </button>
    </form>
  );
}
