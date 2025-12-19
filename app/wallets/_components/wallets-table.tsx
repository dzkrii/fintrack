'use client';

import { Pencil, Trash2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWallets, type Wallet as WalletType } from './wallets-context';

function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function WalletsTable() {
  const { wallets, setOpen, setCurrentWallet, isLoading } = useWallets();

  const handleEdit = (wallet: WalletType) => {
    setCurrentWallet(wallet);
    setOpen('edit');
  };

  const handleDelete = (wallet: WalletType) => {
    setCurrentWallet(wallet);
    setOpen('delete');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Loading wallets...
        </div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Wallet className="h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No wallets yet</h3>
        <p className="text-sm">
          Click &quot;Add Wallet&quot; to create your first wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[60px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[120px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => (
            <TableRow key={wallet.id} className="group/row">
              <TableCell className="text-2xl">{wallet.icon || '💳'}</TableCell>
              <TableCell className="font-medium">{wallet.name}</TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(wallet.balance)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(wallet.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(wallet)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(wallet)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
