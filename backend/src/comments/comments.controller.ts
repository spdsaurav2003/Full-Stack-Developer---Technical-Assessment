import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @Request() req: any,
  ) {
    return this.commentsService.create(taskId, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.commentsService.remove(id, req.user.id);
  }
}
