'use client';

import { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransactions } from './transactions-context';

type TransactionTypeFilter = 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER';

export function TransactionsFilters() {
  const { typeFilter, setTypeFilter, walletFilter, setWalletFilter, wallets, refreshTransactions } =
    useTransactions();

  // Refresh when filters change
  useEffect(() => {
    refreshTransactions();
  }, [typeFilter, walletFilter, refreshTransactions]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Type filter tabs */}
      <Tabs
        value={typeFilter}
        onValueChange={(value) => setTypeFilter(value as TransactionTypeFilter)}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="INCOME" className="text-emerald-600 data-[state=active]:text-emerald-600">
            Income
          </TabsTrigger>
          <TabsTrigger value="EXPENSE" className="text-rose-600 data-[state=active]:text-rose-600">
            Expense
          </TabsTrigger>
          <TabsTrigger value="TRANSFER" className="text-blue-600 data-[state=active]:text-blue-600">
            Transfer
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Wallet filter */}
      <Select
        value={walletFilter || 'all'}
        onValueChange={(value) => setWalletFilter(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Wallets" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Wallets</SelectItem>
          {wallets.map((wallet) => (
            <SelectItem key={wallet.id} value={wallet.id}>
              <span className="flex items-center gap-2">
                <span>{wallet.icon || '💳'}</span>
                <span>{wallet.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
