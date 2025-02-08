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
import { OptionalAuthGuard } from 'src/auth/guards/passport-optional-jwt.guard';
import { UpdatePostDto } from './dto/update-post.dto';

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

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':postId')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  getPost(
    @Param('postId') postId: string,
    @Request() request: { user?: { userId: string } },
  ) {
    const userId = request.user ? request.user.userId : null; // 로그인하지 않는 경우 좋아요 false 처리
    return this.postsService.getPost(postId, userId);
  }

  @Patch(':postId')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) throw new UnauthorizedException('로그인이 필요합니다.');
    const writer = request.user.userId;
    return this.postsService.updatePost(updatePostDto, postId, writer);
  }
}
