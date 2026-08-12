import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(taskId: string, dto: CreateCommentDto, authorId: string) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        authorId,
        taskId,
      },
      include: {
        author: { select: { id: true, name: true, initials: true, color: true } },
      },
    });
  }

  async findByTask(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        author: { select: { id: true, name: true, initials: true, color: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, authorId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Comment deleted' };
  }
}
