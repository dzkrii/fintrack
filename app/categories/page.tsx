import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { CategoriesProvider } from './_components/categories-context';
import { CategoriesPrimaryButtons } from './_components/categories-primary-buttons';
import { CategoriesTable } from './_components/categories-table';
import { CategoriesDialogs } from './_components/categories-dialogs';

async function getCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  // Serialize dates for client
  return categories.map((category) => ({
    ...category,
    createdAt: category.createdAt.toISOString(),
  }));
}

export default async function CategoriesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const categories = await getCategories(userId);

  return (
    <CategoriesProvider initialCategories={categories}>
      <Header fixed>
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Categories</h1>
          <CategoriesPrimaryButtons />
        </div>
      </Header>
      <Main>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Manage your income and expense categories for transactions.
          </p>
        </div>
        <CategoriesTable />
        <CategoriesDialogs />
      </Main>
    </CategoriesProvider>
  );
}
