/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

export interface ProductResponse {
  createdAt: Date;
  favoriteCount: number;
  ownerNickname: string;
  ownerId: string;
  images: string[];
  tags: string[];
  price: number;
  description: string;
  name: string;
  id: string;
}

export interface AllProductsResponse {
  totalCount: number;
  list: ProductResponse[];
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto, ownerId: string) {
    const { images, tags, price, description, name } = createProductDto;

    // 상품 등록
    const product = await this.prisma.product.create({
      data: {
        ownerId,
        name,
        description,
        price,
        images: {
          create: images.map((url) => ({ url })),
        },
        productTags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
        images: true,
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images.map((image) => image.url),
      tags: product.productTags.map((productTag) => productTag.tag.name),
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    };
  }

  async getAllProducts(
    page: number,
    pageSize: number,
    orderBy: string,
    keyword: string,
  ) {
    const skip = (page - 1) * pageSize; // 0
    const orderByField: Prisma.ProductOrderByWithRelationInput =
      orderBy === 'favorite'
        ? { favoriteCount: 'desc' }
        : { createdAt: 'desc' };

    // 검색어가 포함된 상품의 개수와 상품 목록을 조회
    const [totalCount, products] = await Promise.all([
      // 검색어가 포함된 상품의 개수
      this.prisma.product.count({
        where: {
          name: {
            contains: keyword,
          },
        },
      }),
      // 상품 목록 조회
      this.prisma.product.findMany({
        where: {
          name: {
            contains: keyword,
          },
        },
        orderBy: orderByField,
        skip: skip,
        take: pageSize,
        include: {
          owner: {
            select: {
              nickname: true,
            },
          },
          images: true,
          productTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
    ]);

    // 상품 목록이 없을 경우 빈 배열을 반환
    if (!products) {
      return { totalCount: 0, list: [] };
    }

    // 상품 목록을 응답 형식에 맞게 가공
    const list: ProductResponse[] = products.map((product) => ({
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images.map((image) => image.url),
      tags: product.productTags.map((productTag) => productTag.tag.name),
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    }));

    return { totalCount, list };
  }

  async getProduct(productId: string, userId: string | null) {
    // 상품 상세 정보 조회

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
        images: true,
        productTags: {
          include: {
            tag: true,
          },
        },
        // 해당 상품을 좋아요한 사용자 목록 조회
        // 유저가 로그인하지 않은 경우 좋아요 정보를 조회하지 않음
        likes: userId
          ? {
              where: { userId: userId },
            }
          : false,
      },
    });

    // 상품이 없을 경우 에러를 발생시킴
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 해당 유저가 해당 상품을 좋아요 했는지 확인
    const isLiked = userId ? product.likes.length > 0 : false;

    return {
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images.map((image) => image.url),
      tags: product.productTags.map((productTag) => productTag.tag.name),
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
      isFavorite: isLiked, // 해당 유저 정보 필요하네
    };
  }

  async updateProduct(
    updateProductDto: CreateProductDto,
    productId: string,
    ownerId: string,
  ) {
    // 상품 정보 수정
    const { images, tags, price, description, name } = updateProductDto;

    // 상품 조회
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        productTags: true,
      },
    });

    // 상품이 없을 경우 에러 발생
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 상품 소유자와 로그인한 사용자가 다를 경우 에러 발생
    if (product.ownerId !== ownerId) {
      throw new UnauthorizedException('상품을 수정할 권한이 없습니다.');
    }

    // 이미지 업데이트
    if (images) {
      await this.prisma.image.deleteMany({
        where: { productId: productId },
      });
      await this.prisma.image.createMany({
        data: images.map((url) => ({ url, productId })),
      });
    }

    // 태그 업데이트
    if (tags) {
      await this.prisma.productTag.deleteMany({
        where: { productId: productId },
      });
      const tagIds = await Promise.all(
        tags.map(async (tagName) => {
          const tag = await this.prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          return tag.id;
        }),
      );

      await this.prisma.productTag.createMany({
        data: tagIds.map((tagId) => ({
          productId,
          tagId,
        })),
      });
    }

    // 상품 정보 업데이트
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
        images: true,
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      createdAt: updatedProduct.createdAt,
      favoriteCount: updatedProduct.favoriteCount,
      ownerNickname: updatedProduct.owner.nickname,
      ownerId: updatedProduct.ownerId,
      images: updatedProduct.images.map((image) => image.url),
      tags: updatedProduct.productTags.map((productTag) => productTag.tag.name),
      price: updatedProduct.price,
      description: updatedProduct.description,
      name: updatedProduct.name,
      id: updatedProduct.id,
    };
  }
}
