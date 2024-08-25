import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('/last')
  getRecentWishes() {
    return this.wishesService.getRecentWishes();
  }

  @Get('/top')
  getMostPopularWishes() {
    return this.wishesService.getMostPopularWishes();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.createWish(createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.getWishByIdWithOwnerOffersAndWishlists(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishInfo(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const userId = req.user.id;
    let wish: Wish | undefined;
    try {
      wish = await this.wishesService.getWishByIdWithOwnerOffersAndWishlists(
        +id,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wish || wish.owner.id !== userId) {
      throw new UnauthorizedException('You can only edit your own wishes');
    }
    return this.wishesService.updateWishInfo(+id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeWish(@Param('id') id: string) {
    return this.wishesService.removeWish(+id);
  }
}
