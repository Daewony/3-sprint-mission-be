import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

const swaggerCustomOptions = () => {
  const result: SwaggerCustomOptions = {
    customSiteTitle: '스프린트11 API',
  };
  return result;
};

const swaggerOption = (): Omit<OpenAPIObject, 'paths'> => {
  const options = new DocumentBuilder()
    .setTitle('스프린트11 API')
    .setDescription('스프린트11 API 명세서')
    .setVersion('1.0')
    .addTag('Auth', '인증 관리')
    .addTag('Users', '사용자 관리')
    .addTag('Posts', '게시글 관리')
    .addTag('Products', '상품 관리')
    .addTag('Comments', '댓글 관리')
    .addTag('Likes', '좋아요 관리')
    .addTag('ProductTags', '상품 태그 관리')
    .addTag('Tags', '전체 태그 관리')
    .build();

  return options;
};

const docsOptions = {
  swagger: swaggerOption,
  swaggerCustom: swaggerCustomOptions,
};

export default docsOptions;
