/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
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
}
