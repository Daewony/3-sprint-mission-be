import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AllProductsResponse, ProductsService } from './products.service';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: '페이지 당 상품 수',
    example: 10,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: '정렬 기준',
    enum: ['favorite', 'recent'],
    example: 'recent',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: '검색 키워드',
  })
  getAllProducts(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('orderBy') orderBy: string = 'recent',
    @Query('keyword') keyword: string = '',
  ): Promise<AllProductsResponse> {
    return this.productsService.getAllProducts(
      page,
      pageSize,
      orderBy,
      keyword,
    );
  }

  @Get(':productId')
  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  getProduct(@Param('productId') productId: string) {
    return `상품 ${productId}`;
  }

  @Post()
  @ApiOperation({ summary: '상품 등록' })
  createProduct() {
    return '상품 등록 완료';
  }

  @Patch(':productId')
  @ApiOperation({ summary: '상품 정보 수정' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  updateProduct(@Param('productId') productId: string) {
    return `상품 ${productId} 수정 완료`;
  }

  @Delete(':productId')
  @ApiOperation({ summary: '상품 삭제' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  deleteProduct(@Param('productId') productId: string) {
    return `상품 ${productId} 삭제 완료`;
  }

  @Post(':productId/favorite')
  @ApiOperation({ summary: '상품 즐겨찾기 추가' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  addFavorite(@Param('productId') productId: string) {
    return `상품 ${productId} 즐겨찾기 추가`;
  }

  @Delete(':productId/favorite')
  @ApiOperation({ summary: '상품 즐겨찾기 제거' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  removeFavorite(@Param('productId') productId: string) {
    return `상품 ${productId} 즐겨찾기 제거`;
  }
}
