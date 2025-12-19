'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallets } from './wallets-context';

export function WalletsPrimaryButtons() {
  const { setOpen } = useWallets();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <Plus size={18} />
        <span>Add Wallet</span>
      </Button>
    </div>
  );
}
