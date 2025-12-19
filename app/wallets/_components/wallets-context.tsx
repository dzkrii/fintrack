'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// Wallet type matching Prisma schema
export interface Wallet {
  id: string;
  name: string;
  balance: number | string;
  icon: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

type DialogType = 'add' | 'edit' | 'delete' | null;

interface WalletsContextType {
  open: DialogType;
  setOpen: (type: DialogType) => void;
  currentWallet: Wallet | null;
  setCurrentWallet: (wallet: Wallet | null) => void;
  wallets: Wallet[];
  setWallets: (wallets: Wallet[]) => void;
  refreshWallets: () => Promise<void>;
  isLoading: boolean;
}

const WalletsContext = createContext<WalletsContextType | null>(null);

export function useWallets() {
  const context = useContext(WalletsContext);
  if (!context) {
    throw new Error('useWallets must be used within a WalletsProvider');
  }
  return context;
}

interface WalletsProviderProps {
  children: ReactNode;
  initialWallets?: Wallet[];
}

export function WalletsProvider({
  children,
  initialWallets = [],
}: WalletsProviderProps) {
  const [open, setOpen] = useState<DialogType>(null);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWallets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wallets');
      if (response.ok) {
        const data = await response.json();
        setWallets(data);
      }
    } catch (error) {
      console.error('Failed to refresh wallets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <WalletsContext.Provider
      value={{
        open,
        setOpen,
        currentWallet,
        setCurrentWallet,
        wallets,
        setWallets,
        refreshWallets,
        isLoading,
      }}
    >
      {children}
    </WalletsContext.Provider>
  );
}
