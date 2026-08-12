import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';

// Build absolute file URL for SQLite
const dbPath = path.resolve(__dirname, '..', 'dev.db');
const dbUrl = `file:${dbPath}`;
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');
  console.log('📁 Database path:', dbPath);

  // Create labels
  await Promise.all([
    prisma.label.upsert({ where: { name: 'Research' }, update: {}, create: { name: 'Research', color: '#8B5CF6' } }),
    prisma.label.upsert({ where: { name: 'Design' }, update: {}, create: { name: 'Design', color: '#EC4899' } }),
    prisma.label.upsert({ where: { name: 'Development' }, update: {}, create: { name: 'Development', color: '#3B82F6' } }),
    prisma.label.upsert({ where: { name: 'Testing' }, update: {}, create: { name: 'Testing', color: '#10B981' } }),
    prisma.label.upsert({ where: { name: 'Deployment' }, update: {}, create: { name: 'Deployment', color: '#F97316' } }),
  ]);
  console.log('✅ Labels created');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@taskmanager.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@taskmanager.com', password: await bcrypt.hash('password123', 10), initials: 'AD', color: '#7C3AED', isGuest: false },
  });

  const dexterUser = await prisma.user.upsert({
    where: { email: 'dexter@taskmanager.com' },
    update: {},
    create: { name: 'Dexter', email: 'dexter@taskmanager.com', password: await bcrypt.hash('password123', 10), initials: 'DX', color: '#EC4899', isGuest: false },
  });
  console.log('✅ Users created');

  // Labels
  const research = await prisma.label.findUnique({ where: { name: 'Research' } });
  const design = await prisma.label.findUnique({ where: { name: 'Design' } });
  const development = await prisma.label.findUnique({ where: { name: 'Development' } });
  const testing = await prisma.label.findUnique({ where: { name: 'Testing' } });
  const deployment = await prisma.label.findUnique({ where: { name: 'Deployment' } });

  // Tasks
  await prisma.task.upsert({ where: { id: 'task-1' }, update: {}, create: { id: 'task-1', title: 'Write API Documentation', description: 'Create clear and detailed API documentation to guide developers.', status: 'TODO', priority: 'HIGH', dueDate: new Date('2026-07-31'), assigneeId: adminUser.id, order: 1 } });
  await prisma.task.upsert({ where: { id: 'task-2' }, update: {}, create: { id: 'task-2', title: 'Implement Search Function', description: 'Add full-text search to the task list.', status: 'TODO', priority: 'MEDIUM', dueDate: new Date('2026-08-15'), assigneeId: adminUser.id, order: 2 } });
  await prisma.task.upsert({ where: { id: 'task-3' }, update: {}, create: { id: 'task-3', title: 'Deploy to Production', description: 'Deploy the latest build to production.', status: 'TODO', priority: 'URGENT', dueDate: new Date('2026-08-20'), assigneeId: adminUser.id, order: 3 } });
  await prisma.task.upsert({ where: { id: 'task-4' }, update: {}, create: { id: 'task-4', title: 'Design Homepage', description: 'Design the new homepage layout.', status: 'DOING', priority: 'HIGH', dueDate: new Date('2026-09-12'), assigneeId: dexterUser.id, order: 1 } });
  await prisma.task.upsert({ where: { id: 'task-5' }, update: {}, create: { id: 'task-5', title: 'Develop Login Feature', description: 'Implement email/password and OAuth login.', status: 'DOING', priority: 'LOW', dueDate: new Date('2026-09-15'), assigneeId: adminUser.id, order: 2 } });
  await prisma.task.upsert({ where: { id: 'task-6' }, update: {}, create: { id: 'task-6', title: 'Test Payment Gateway', description: 'End-to-end testing for Stripe integration.', status: 'DOING', priority: 'MEDIUM', dueDate: new Date('2026-09-18'), assigneeId: adminUser.id, order: 3 } });
  await prisma.task.upsert({ where: { id: 'task-7' }, update: {}, create: { id: 'task-7', title: 'Design Homepage (v1)', description: 'Initial design completed and approved.', status: 'COMPLETED', priority: 'HIGH', dueDate: new Date('2026-09-12'), assigneeId: dexterUser.id, order: 1 } });
  await prisma.task.upsert({ where: { id: 'task-8' }, update: {}, create: { id: 'task-8', title: 'Develop Login Feature (v1)', description: 'Basic auth flow completed.', status: 'COMPLETED', priority: 'LOW', dueDate: new Date('2026-09-15'), assigneeId: adminUser.id, order: 2 } });

  // Labels for task-1
  if (research) await prisma.taskLabel.upsert({ where: { taskId_labelId: { taskId: 'task-1', labelId: research.id } }, update: {}, create: { taskId: 'task-1', labelId: research.id } });
  if (design) await prisma.taskLabel.upsert({ where: { taskId_labelId: { taskId: 'task-1', labelId: design.id } }, update: {}, create: { taskId: 'task-1', labelId: design.id } });
  if (development) await prisma.taskLabel.upsert({ where: { taskId_labelId: { taskId: 'task-1', labelId: development.id } }, update: {}, create: { taskId: 'task-1', labelId: development.id } });
  if (testing) await prisma.taskLabel.upsert({ where: { taskId_labelId: { taskId: 'task-1', labelId: testing.id } }, update: {}, create: { taskId: 'task-1', labelId: testing.id } });
  if (deployment) await prisma.taskLabel.upsert({ where: { taskId_labelId: { taskId: 'task-1', labelId: deployment.id } }, update: {}, create: { taskId: 'task-1', labelId: deployment.id } });

  // Subtasks
  await prisma.subtask.upsert({ where: { id: 'subtask-1' }, update: {}, create: { id: 'subtask-1', title: 'Subtask 1', priority: 'HIGH', dueDate: new Date('2026-09-12'), taskId: 'task-1', assigneeId: dexterUser.id } });
  await prisma.subtask.upsert({ where: { id: 'subtask-2' }, update: {}, create: { id: 'subtask-2', title: 'Subtask 2', priority: 'LOW', dueDate: new Date('2026-09-15'), taskId: 'task-1' } });
  await prisma.subtask.upsert({ where: { id: 'subtask-3' }, update: {}, create: { id: 'subtask-3', title: 'Subtask 3', priority: 'MEDIUM', dueDate: new Date('2026-09-18'), taskId: 'task-1' } });

  // Comment
  await prisma.comment.upsert({ where: { id: 'comment-1' }, update: {}, create: { id: 'comment-1', content: 'Great progress so far! Keep it up.', authorId: adminUser.id, taskId: 'task-1' } });

  console.log('✅ Tasks, subtasks, and comments created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
