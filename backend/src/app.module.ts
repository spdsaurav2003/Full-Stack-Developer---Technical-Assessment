import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { LabelsModule } from './labels/labels.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    TasksModule,
    SubtasksModule,
    CommentsModule,
    UsersModule,
    LabelsModule,
  ],
})
export class AppModule {}
