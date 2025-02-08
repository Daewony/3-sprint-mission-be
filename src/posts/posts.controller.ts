import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '게시글 등록' })
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) throw new UnauthorizedException('로그인이 필요합니다.');
    const ownerId = request.user.userId;
    return this.postsService.createPost(createPostDto, ownerId);
  }
}
