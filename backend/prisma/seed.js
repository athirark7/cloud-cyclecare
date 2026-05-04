const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log({ user });

  // Add sample cycle
  const cycle = await prisma.cycle.create({
    data: {
      userId: user.id,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-05'),
      cycleLength: 28,
    }
  });

  console.log('Sample data seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
