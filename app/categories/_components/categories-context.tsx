'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

// Category type matching Prisma schema
export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon: string | null;
  userId: string;
  createdAt: string;
}

type DialogType = 'add' | 'edit' | 'delete' | null;

interface CategoriesContextType {
  open: DialogType;
  setOpen: (type: DialogType) => void;
  currentCategory: Category | null;
  setCurrentCategory: (category: Category | null) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  refreshCategories: () => Promise<void>;
  isLoading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}

interface CategoriesProviderProps {
  children: ReactNode;
  initialCategories?: Category[];
}

export function CategoriesProvider({
  children,
  initialCategories = [],
}: CategoriesProviderProps) {
  const [open, setOpen] = useState<DialogType>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to refresh categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        open,
        setOpen,
        currentCategory,
        setCurrentCategory,
        categories,
        setCategories,
        refreshCategories,
        isLoading,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}
