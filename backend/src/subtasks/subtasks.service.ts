import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: string, dto: CreateSubtaskDto) {
    return this.prisma.subtask.create({
      data: {
        ...(dto as any),
        taskId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      } as any,
    });
  }

  async findByTask(taskId: string) {
    return this.prisma.subtask.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, dto: UpdateSubtaskDto) {
    const subtask = await this.prisma.subtask.findUnique({ where: { id } });
    if (!subtask) throw new NotFoundException(`Subtask #${id} not found`);

    return this.prisma.subtask.update({
      where: { id },
      data: {
        ...(dto as any),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      } as any,
    });
  }

  async remove(id: string) {
    await this.prisma.subtask.delete({ where: { id } });
    return { message: 'Subtask deleted' };
  }
}
