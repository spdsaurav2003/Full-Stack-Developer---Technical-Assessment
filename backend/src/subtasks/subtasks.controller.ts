import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post('tasks/:taskId/subtasks')
  create(@Param('taskId') taskId: string, @Body() dto: CreateSubtaskDto) {
    return this.subtasksService.create(taskId, dto);
  }

  @Get('tasks/:taskId/subtasks')
  findByTask(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTask(taskId);
  }

  @Patch('subtasks/:id')
  update(@Param('id') id: string, @Body() dto: UpdateSubtaskDto) {
    return this.subtasksService.update(id, dto);
  }

  @Delete('subtasks/:id')
  remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
