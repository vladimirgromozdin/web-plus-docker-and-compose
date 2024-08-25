import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
