import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ImageModule } from './image/image.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [ImageModule],
})
export class ProductsModule {}
