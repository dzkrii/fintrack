'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactions } from './transactions-context';

export function TransactionsPrimaryButtons() {
  const { setOpen } = useTransactions();

  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <Plus size={18} />
        <span>Add Transaction</span>
      </Button>
    </div>
  );
}
