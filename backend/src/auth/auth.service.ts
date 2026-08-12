import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async guestLogin(name?: string) {
    const guestName = name || `Guest_${Math.random().toString(36).substring(2, 7)}`;
    const initials = guestName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const colors = ['#7C3AED', '#EC4899', '#3B82F6', '#10B981', '#F97316'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const guest = await this.prisma.user.create({
      data: {
        name: guestName,
        email: `guest_${Date.now()}@guest.local`,
        isGuest: true,
        initials,
        color,
      },
    });

    const payload = { sub: guest.id, email: guest.email, isGuest: true };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: guest.id,
        name: guest.name,
        email: guest.email,
        initials: guest.initials,
        color: guest.color,
        isGuest: guest.isGuest,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, isGuest: false };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        color: user.color,
        isGuest: user.isGuest,
      },
    };
  }

  async validateToken(payload: any) {
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }
}
