import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up
  await prisma.refreshToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create demo user
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@taskflow.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create sample tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Set up the project repository',
        description: 'Initialize git, add .gitignore, and push initial commit.',
        status: 'completed',
        userId: user.id,
      },
      {
        title: 'Design database schema',
        description: 'Define User, Task, and RefreshToken models in Prisma.',
        status: 'completed',
        userId: user.id,
      },
      {
        title: 'Implement JWT authentication',
        description:
          'Add access token (15m) and refresh token (7d) flow with bcrypt password hashing.',
        status: 'completed',
        userId: user.id,
      },
      {
        title: 'Build task CRUD API',
        description: 'GET /tasks with pagination, filtering, search. POST, PATCH, DELETE, toggle.',
        status: 'pending',
        userId: user.id,
      },
      {
        title: 'Build Next.js frontend',
        description: 'Login, register, and dashboard pages with TailwindCSS styling.',
        status: 'pending',
        userId: user.id,
      },
      {
        title: 'Write integration tests',
        description: 'Cover all auth and task endpoints with Supertest + Jest.',
        status: 'pending',
        userId: user.id,
      },
      {
        title: 'Deploy to production',
        description: 'Deploy backend to Railway/Render and frontend to Vercel.',
        status: 'pending',
        userId: user.id,
      },
    ],
  });

  console.log(`✅ Created ${tasks.count} tasks`);
  console.log('\n📋 Demo credentials:');
  console.log('   Email:    demo@taskflow.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
