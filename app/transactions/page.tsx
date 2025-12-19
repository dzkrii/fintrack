import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { CreditCard } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <>
      <Header fixed>
        <h1 className="text-lg font-semibold">Transactions</h1>
      </Header>
      <Main>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
          <CreditCard className="h-16 w-16 mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
          <p className="text-center max-w-md">
            Track your income and expenses here. This page will display all your financial transactions.
          </p>
        </div>
      </Main>
    </>
  );
}
