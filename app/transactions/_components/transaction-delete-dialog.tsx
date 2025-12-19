'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTransactions, type Transaction } from './transactions-context';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface TransactionDeleteDialogProps {
  currentTransaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDeleteDialog({
  currentTransaction,
  open,
  onOpenChange,
}: TransactionDeleteDialogProps) {
  const { refreshTransactions } = useTransactions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/transactions/${currentTransaction.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete transaction');
      }

      await refreshTransactions();
      onOpenChange(false);
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTransactionDescription = () => {
    const amount = formatCurrency(currentTransaction.amount);
    const type = currentTransaction.type.toLowerCase();
    
    if (currentTransaction.type === 'TRANSFER') {
      return `${type} of ${amount} from ${currentTransaction.wallet.name} to ${currentTransaction.toWallet?.name}`;
    }
    
    return `${type} of ${amount} in ${currentTransaction.wallet.name}`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              Are you sure you want to delete this{' '}
              <strong className="text-foreground">{getTransactionDescription()}</strong>?
            </span>
            <span className="block text-amber-600 dark:text-amber-400">
              This will reverse the balance changes in your wallet(s).
            </span>
            <span className="block">
              This action cannot be undone.
            </span>
            {error && (
              <span className="block text-destructive font-medium">
                {error}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
