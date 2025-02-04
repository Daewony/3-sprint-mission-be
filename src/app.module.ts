import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { TagsModule } from './tags/tags.module';
import { ProductsModule } from './products/products.module';
import { ProductTagsModule } from './product_tags/product_tags.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [CardsModule, UsersModule, CommentsModule, LikesModule, PostsModule, ProductTagsModule, ProductsModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
