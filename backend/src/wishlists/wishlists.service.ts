import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly WishesService: WishesService,
  ) {}

  async createWishlist(userId: number, createWishlistDto: CreateWishlistDto) {
    let user: User | undefined;
    try {
      user = await this.userRepository.findOne({ where: { id: userId } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const { name, image, itemsId } = createWishlistDto;
    const newWishlist = this.wishlistRepository.create();
    newWishlist.name = name;
    newWishlist.image = image;
    newWishlist.owner = user;

    const items: Wish[] = [];
    for (const id of itemsId) {
      try {
        const wish =
          await this.WishesService.getWishByIdWithOwnerOffersAndWishlists(id);
        items.push(wish);
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
    newWishlist.items = items;
    try {
      await this.wishlistRepository.save(newWishlist);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return newWishlist;
  }

  async getAllWishlistsWithOwnersAndItems(): Promise<Wishlist[]> {
    let wishlists: Wishlist[];
    try {
      wishlists = await this.wishlistRepository.find({
        relations: ['owner', 'items'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch wishlists: ${error.message}`,
      );
    }

    if (!wishlists.length) {
      throw new NotFoundException(`No wishlists found.`);
    }

    return wishlists;
  }

  async getWishlistByIdWithOwnerAndItems(id: number): Promise<Wishlist> {
    let wishlist: Wishlist | undefined;
    try {
      wishlist = await this.wishlistRepository.findOne({
        where: { id },
        relations: ['owner', 'items'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch wishlist: ${error.message}`,
      );
    }

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found.`);
    }

    return wishlist;
  }

  async updateWishlist(id: number, updateWishlistDto: UpdateWishlistDto) {
    let wishlistToUpdate: Wishlist | undefined;
    try {
      wishlistToUpdate = await this.wishlistRepository.findOne({
        where: { id: id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch wishlist due to an error: ${error.message}`,
      );
    }
    if (!wishlistToUpdate) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
    Object.assign(wishlistToUpdate, updateWishlistDto);
    await this.wishlistRepository.save(wishlistToUpdate);
    return wishlistToUpdate;
  }

  async removeWishlist(id: number) {
    let wishlist: Wishlist | undefined;
    try {
      wishlist = await this.wishlistRepository.findOne({
        where: { id: id },
        relations: ['items'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found.`);
    }
    try {
      wishlist.items = [];
      await this.wishlistRepository.save(wishlist);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update Wishlist with ID ${id}`,
      );
    }
    try {
      await this.wishlistRepository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to delete Wishlist with ID ${id}`,
      );
    }
  }
}
