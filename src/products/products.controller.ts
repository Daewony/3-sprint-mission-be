import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: '상품 목록 조회' })
  getAllProducts() {
    return '상품 목록';
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
