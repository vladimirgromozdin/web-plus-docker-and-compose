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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishlistDto: CreateWishlistDto) {
    const userId = req.user.id;
    return this.wishlistsService.createWishlist(userId, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getAllWishlistsWithOwnersAndItems() {
    return this.wishlistsService.getAllWishlistsWithOwnersAndItems();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishlistByIdWithOwnerAndItems(@Param('id') id: string) {
    return this.wishlistsService.getWishlistByIdWithOwnerAndItems(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishlist(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = req.user.id;
    let wishlist: Wishlist | undefined;
    try {
      wishlist = await this.wishlistsService.getWishlistByIdWithOwnerAndItems(
        +id,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wishlist || wishlist.owner.id === userId) {
      throw new UnauthorizedException('You can only edit your own wishlist');
    }
    return this.wishlistsService.updateWishlist(+id, updateWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeWishlist(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    let wishlist: Wishlist | undefined;
    try {
      wishlist = await this.wishlistsService.getWishlistByIdWithOwnerAndItems(
        +id,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wishlist || wishlist.owner.id === userId) {
      throw new UnauthorizedException('You can only delete your own wishlist');
    }
    return this.wishlistsService.removeWishlist(+id);
  }
}
