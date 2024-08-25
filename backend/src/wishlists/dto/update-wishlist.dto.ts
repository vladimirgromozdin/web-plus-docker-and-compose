import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  itemsId?: number[];
}
