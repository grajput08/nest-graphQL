import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create dummy users
  const users = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
    },
    {
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: user,
      });
      console.log(`Created user: ${user.name} (${user.email})`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
