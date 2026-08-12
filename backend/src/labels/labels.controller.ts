import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  findAll() {
    return this.labelsService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; color: string }) {
    return this.labelsService.create(body.name, body.color);
  }
}
