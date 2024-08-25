import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(250)
  name?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  link?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  image?: string;

  @IsOptional()
  @IsNotEmpty()
  price?: number;

  @IsOptional()
  @Length(1, 1024)
  description?: string;
}
