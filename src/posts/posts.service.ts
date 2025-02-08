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

  // 모든 게시글 조회
  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' }, // 최신순 정렬
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
    return posts;
  }

  // 게시글 상세 조회
  async getPost(postId: string, userId: string | null) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
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
        // 해당 게시글을 좋아요한 사용자 목록 조회
        // 유저가 로그인하지 않은 경우 좋아요 정보를 조회하지 않음
        likes: userId ? { where: { id: userId } } : false,
      },
    });

    // 게시글이 없을 경우 예외 처리
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    // 해당 유저가 해당 게시글에 좋아요 했는지 확인
    const isLiked = userId ? post.likes.length > 0 : false;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      image: (post.image ?? null) as string | null,
      favoriteCount: post.favoriteCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      writer: {
        id: post.writer.id as string,
        nickname: post.writer.nickname as string,
      },
      isFavorite: isLiked,
    };
  }
}
