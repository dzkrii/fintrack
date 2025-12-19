import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { PiggyBank } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <>
      <Header fixed>
        <h1 className="text-lg font-semibold">Budgets</h1>
      </Header>
      <Main>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
          <PiggyBank className="h-16 w-16 mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">Budgets</h2>
          <p className="text-center max-w-md">
            Plan and manage your budgets here. Set spending limits and track your progress.
          </p>
        </div>
      </Main>
    </>
  );
}
