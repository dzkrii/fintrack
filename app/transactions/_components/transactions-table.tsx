'use client';

import { ArrowRightLeft, CreditCard, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTransactions, type Transaction } from './transactions-context';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getTypeBadge(type: Transaction['type']) {
  switch (type) {
    case 'INCOME':
      return (
        <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950">
          Income
        </Badge>
      );
    case 'EXPENSE':
      return (
        <Badge variant="outline" className="border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950">
          Expense
        </Badge>
      );
    case 'TRANSFER':
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950">
          Transfer
        </Badge>
      );
  }
}

function getAmountDisplay(transaction: Transaction) {
  const amount = formatCurrency(transaction.amount);
  switch (transaction.type) {
    case 'INCOME':
      return <span className="text-emerald-600 font-medium">+{amount}</span>;
    case 'EXPENSE':
      return <span className="text-rose-600 font-medium">-{amount}</span>;
    case 'TRANSFER':
      return <span className="text-blue-600 font-medium">{amount}</span>;
  }
}

export function TransactionsTable() {
  const { transactions, setOpen, setCurrentTransaction, isLoading } = useTransactions();

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setOpen('edit');
  };

  const handleDelete = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setOpen('delete');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Loading transactions...
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <CreditCard className="h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
        <p className="text-sm">
          Click &quot;Add Transaction&quot; to record your first transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="group/row">
              <TableCell className="text-muted-foreground">
                {formatDate(transaction.date)}
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">
                {transaction.description || '-'}
              </TableCell>
              <TableCell>
                {transaction.type === 'TRANSFER' ? (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <ArrowRightLeft className="h-4 w-4" />
                    Transfer
                  </span>
                ) : transaction.category ? (
                  <span className="flex items-center gap-1">
                    <span>{transaction.category.icon || '📁'}</span>
                    <span>{transaction.category.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {transaction.type === 'TRANSFER' ? (
                  <span className="flex items-center gap-1 text-sm">
                    <span>{transaction.wallet.icon || '💳'}</span>
                    <span>{transaction.wallet.name}</span>
                    <ArrowRightLeft className="h-3 w-3 mx-1 text-muted-foreground" />
                    <span>{transaction.toWallet?.icon || '💳'}</span>
                    <span>{transaction.toWallet?.name}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span>{transaction.wallet.icon || '💳'}</span>
                    <span>{transaction.wallet.name}</span>
                  </span>
                )}
              </TableCell>
              <TableCell>{getTypeBadge(transaction.type)}</TableCell>
              <TableCell className="text-right font-mono">
                {getAmountDisplay(transaction)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(transaction)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction)}
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
