import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: { isGuest: false },
      select: { id: true, name: true, email: true, initials: true, color: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, initials: true, color: true, isGuest: true },
    });
  }
}
