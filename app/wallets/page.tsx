import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { WalletsProvider } from './_components/wallets-context';
import { WalletsPrimaryButtons } from './_components/wallets-primary-buttons';
import { WalletsTable } from './_components/wallets-table';
import { WalletsDialogs } from './_components/wallets-dialogs';

async function getWallets(userId: string) {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  // Serialize Decimal to number for client
  return wallets.map((wallet) => ({
    ...wallet,
    balance: wallet.balance.toNumber(),
    createdAt: wallet.createdAt.toISOString(),
    updatedAt: wallet.updatedAt.toISOString(),
  }));
}

export default async function WalletsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const wallets = await getWallets(userId);

  return (
    <WalletsProvider initialWallets={wallets}>
      <Header fixed>
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Wallets</h1>
          <WalletsPrimaryButtons />
        </div>
      </Header>
      <Main>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Manage your bank accounts, wallets, and payment methods.
          </p>
        </div>
        <WalletsTable />
        <WalletsDialogs />
      </Main>
    </WalletsProvider>
  );
}
