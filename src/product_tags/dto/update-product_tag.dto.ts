import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTagDto } from './create-product_tag.dto';

export class UpdateProductTagDto extends PartialType(CreateProductTagDto) {}
