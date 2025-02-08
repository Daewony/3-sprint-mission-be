import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  // 포스트 등록
  async createPost(createPostDto: CreatePostDto, ownerId: string) {
    const post = await this.prisma.post.create({
      data: {
        ...createPostDto,
        writer: { connect: { id: ownerId } },
        favoriteCount: 0,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
        writer: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    return post;
  }
}
