import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Wallet } from 'lucide-react';

export default function AccountsPage() {
  return (
    <>
      <Header fixed>
        <h1 className="text-lg font-semibold">Wallets</h1>
      </Header>
      <Main>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
          <Wallet className="h-16 w-16 mb-4 opacity-50" />
          <h2 className="text-2xl font-semibold mb-2">Wallets</h2>
          <p className="text-center max-w-md">
            Manage your bank accounts, wallets, and payment methods here.
          </p>
        </div>
      </Main>
    </>
  );
}
