'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// Related entity types
export interface WalletInfo {
  id: string;
  name: string;
  icon: string | null;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string | null;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
}

// Transaction type matching Prisma schema
export interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  userId: string;
  walletId: string;
  wallet: WalletInfo;
  toWalletId: string | null;
  toWallet: WalletInfo | null;
  categoryId: string | null;
  category: CategoryInfo | null;
  createdAt: string;
  updatedAt: string;
}

type DialogType = 'add' | 'edit' | 'delete' | null;
type TransactionTypeFilter = 'ALL' | 'INCOME' | 'EXPENSE' | 'TRANSFER';

interface TransactionsContextType {
  open: DialogType;
  setOpen: (type: DialogType) => void;
  currentTransaction: Transaction | null;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  refreshTransactions: () => Promise<void>;
  isLoading: boolean;
  // Filters
  typeFilter: TransactionTypeFilter;
  setTypeFilter: (type: TransactionTypeFilter) => void;
  walletFilter: string | null;
  setWalletFilter: (walletId: string | null) => void;
  // Available wallets and categories for forms
  wallets: WalletInfo[];
  categories: CategoryInfo[];
}

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}

interface TransactionsProviderProps {
  children: ReactNode;
  initialTransactions?: Transaction[];
  wallets?: WalletInfo[];
  categories?: CategoryInfo[];
}

export function TransactionsProvider({
  children,
  initialTransactions = [],
  wallets = [],
  categories = [],
}: TransactionsProviderProps) {
  const [open, setOpen] = useState<DialogType>(null);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('ALL');
  const [walletFilter, setWalletFilter] = useState<string | null>(null);

  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') {
        params.set('type', typeFilter);
      }
      if (walletFilter) {
        params.set('walletId', walletFilter);
      }
      
      const url = `/api/transactions${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, walletFilter]);

  return (
    <TransactionsContext.Provider
      value={{
        open,
        setOpen,
        currentTransaction,
        setCurrentTransaction,
        transactions,
        setTransactions,
        refreshTransactions,
        isLoading,
        typeFilter,
        setTypeFilter,
        walletFilter,
        setWalletFilter,
        wallets,
        categories,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
