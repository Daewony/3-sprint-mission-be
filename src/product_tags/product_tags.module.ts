import { Module } from '@nestjs/common';
import { ProductTagsService } from './product_tags.service';
import { ProductTagsController } from './product_tags.controller';

@Module({
  controllers: [ProductTagsController],
  providers: [ProductTagsService],
})
export class ProductTagsModule {}
