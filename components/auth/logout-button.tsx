'use client';

import { logout } from '@/app/lib/actions';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
