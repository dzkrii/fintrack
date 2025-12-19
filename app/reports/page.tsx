import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <>
      <Header fixed>
        <h1 className="text-lg font-semibold">Reports</h1>
      </Header>
      <Main>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
          <BarChart3 className="h-16 w-16 mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">Reports</h2>
          <p className="text-center max-w-md">
            View financial reports and analytics to understand your spending patterns.
          </p>
        </div>
      </Main>
    </>
  );
}
