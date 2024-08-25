import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  createOffer(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const userId = req.user.id;
    return this.offersService.createOffer(userId, createOfferDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getAllOffersWithUsersAndItems() {
    return this.offersService.getAllOffersWithUsersAndItems();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOfferByIdWithUsersAndItems(@Param('id') id: number) {
    return this.offersService.getOfferByIdWithUsersAndItems(+id);
  }
}
