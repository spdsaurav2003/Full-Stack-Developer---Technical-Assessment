import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TASK_INCLUDE: any = {
  assignee: {
    select: { id: true, name: true, initials: true, color: true, email: true },
  },
  labels: {
    include: { label: true },
  },
  subtasks: {
    orderBy: { createdAt: 'asc' },
  },
  comments: {
    include: {
      author: { select: { id: true, name: true, initials: true, color: true } },
    },
    orderBy: { createdAt: 'desc' },
  },
};


@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { status?: string; search?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const tasks = await this.prisma.task.findMany({
      where,
      include: TASK_INCLUDE,
      orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });

    return tasks.map(this.formatTask);
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: TASK_INCLUDE,
    });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return this.formatTask(task);
  }

  async create(dto: CreateTaskDto, userId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dtoAny = dto as any;
    const { labelIds } = dtoAny;

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: (dto as any).status,
        priority: (dto as any).priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: (dto as any).assigneeId || userId,
        labels: labelIds
          ? {
              create: labelIds.map((labelId: string) => ({ labelId })),
            }
          : undefined,
      } as any,
      include: TASK_INCLUDE,
    });

    return this.formatTask(task);
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dtoAny = dto as any;
    const { labelIds } = dtoAny;

    // Handle label updates
    if (labelIds !== undefined) {
      await this.prisma.taskLabel.deleteMany({ where: { taskId: id } });
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: (dto as any).status,
        priority: (dto as any).priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: (dto as any).assigneeId,
        labels: labelIds
          ? {
              create: labelIds.map((labelId: string) => ({ labelId })),
            }
          : undefined,
      } as any,
      include: TASK_INCLUDE,
    });

    return this.formatTask(task);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatTask(task: any) {
    return {
      ...task,
      labels: task.labels.map((tl: any) => tl.label),
    };
  }
}
