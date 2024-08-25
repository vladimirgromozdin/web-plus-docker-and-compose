import { IsNotEmpty, IsUrl, Length, MaxLength } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  price: number;

  @Length(1, 1024)
  description: string;
}
