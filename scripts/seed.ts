import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Initial Categories Data
const incomeCategories = [
  { name: 'Gaji', icon: '💰' },
  { name: 'Investasi', icon: '📈' },
  { name: 'Freelance', icon: '💻' },
  { name: 'Hadiah', icon: '🎁' },
  { name: 'Bonus', icon: '🎉' },
  { name: 'Cashback', icon: '💸' },
  { name: 'Lainnya', icon: '📥' },
];

const expenseCategories = [
  { name: 'Makanan & Minuman', icon: '🍔' },
  { name: 'Transportasi', icon: '🚗' },
  { name: 'Belanja', icon: '🛒' },
  { name: 'Hiburan', icon: '🎬' },
  { name: 'Tagihan', icon: '📄' },
  { name: 'Kesehatan', icon: '🏥' },
  { name: 'Pendidikan', icon: '📚' },
  { name: 'Perawatan Diri', icon: '💅' },
  { name: 'Liburan', icon: '✈️' },
  { name: 'Groceries', icon: '🛍️' },
  { name: 'Rumah', icon: '🏠' },
  { name: 'Pulsa & Internet', icon: '📱' },
  { name: 'Donasi', icon: '🙏' },
  { name: 'Lainnya', icon: '📤' },
];

// Initial Wallets Data
const wallets = [
  { name: 'Cash', icon: '💵' },
  { name: 'BCA', icon: '🏦' },
  { name: 'BRI', icon: '🏦' },
  { name: 'Dana', icon: '📲' },
  { name: 'GoPay', icon: '📲' },
  { name: 'Jago', icon: '🏦' },
  { name: 'Mandiri', icon: '🏦' },
  { name: 'SeaBank', icon: '🏦' },
  { name: 'ShopeePay', icon: '📲' },
  { name: 'OVO', icon: '📲' },
];

async function main() {
  // Create/Update User
  const password = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      name: 'Test User',
      password,
    },
  });
  console.log('✅ Created user:', user.username);

  // Seed Income Categories
  console.log('\n📥 Seeding income categories...');
  for (const category of incomeCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        type: 'INCOME',
        userId: user.id,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          type: 'INCOME',
          icon: category.icon,
          userId: user.id,
        },
      });
      console.log(`  ✅ Created income category: ${category.name}`);
    } else {
      console.log(`  ⏭️  Skipped (exists): ${category.name}`);
    }
  }

  // Seed Expense Categories
  console.log('\n📤 Seeding expense categories...');
  for (const category of expenseCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        type: 'EXPENSE',
        userId: user.id,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          type: 'EXPENSE',
          icon: category.icon,
          userId: user.id,
        },
      });
      console.log(`  ✅ Created expense category: ${category.name}`);
    } else {
      console.log(`  ⏭️  Skipped (exists): ${category.name}`);
    }
  }

  // Seed Wallets
  console.log('\n💳 Seeding wallets...');
  for (const wallet of wallets) {
    const existing = await prisma.wallet.findFirst({
      where: {
        name: wallet.name,
        userId: user.id,
      },
    });

    if (!existing) {
      await prisma.wallet.create({
        data: {
          name: wallet.name,
          icon: wallet.icon,
          balance: 0,
          userId: user.id,
        },
      });
      console.log(`  ✅ Created wallet: ${wallet.name}`);
    } else {
      console.log(`  ⏭️  Skipped (exists): ${wallet.name}`);
    }
  }

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
