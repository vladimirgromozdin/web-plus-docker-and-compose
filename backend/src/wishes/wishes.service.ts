import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createWish(createWishDto: CreateWishDto) {
    try {
      const wish = this.wishRepository.create(createWishDto);
      return this.wishRepository.save(wish);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getRecentWishes() {
    try {
      return await this.wishRepository.find({
        order: { createdAt: 'DESC' },
        take: 40,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve recent 40 wishes: ${error.message}`,
      );
    }
  }

  async getMostPopularWishes() {
    try {
      return await this.wishRepository.find({
        order: { copied: 'DESC' },
        take: 10,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve 10 most copied wishes: ${error.message}`,
      );
    }
  }

  async getWishByIdWithOwnerOffersAndWishlists(id: number) {
    let wish: Wish | undefined;
    try {
      wish = await this.wishRepository.findOne({
        where: { id },
        relations: ['owner', 'offers', 'wishlists'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch offer due to an error: ${error.message}`,
      );
    }
    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found.`);
    }
    return wish;
  }

  async updateWishInfo(id: number, newWishData: UpdateWishDto) {
    let wishToUpdate: Wish | undefined;
    try {
      wishToUpdate = await this.wishRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch wish due to an error: ${error.message}`,
      );
    }
    if (!wishToUpdate) {
      throw new NotFoundException(`Wish with ID ${id} not found.`);
    }
    if (wishToUpdate.raised > 0) {
      throw new BadRequestException(
        'Cannot change the price of a wish since money has been raised',
      );
    }
    Object.assign(wishToUpdate, newWishData);
    await this.wishRepository.save(wishToUpdate);
    return wishToUpdate;
  }

  async copyWishToUser(wishId: number, userId: number) {
    let wishToCopy: Wish | undefined;
    let user: User | undefined;

    try {
      wishToCopy = await this.getWishByIdWithOwnerOffersAndWishlists(wishId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve wish: ${error.message}`,
      );
    }

    if (!wishToCopy) {
      throw new NotFoundException(`Wish with ID ${wishId} not found.`);
    }

    try {
      user = await this.userRepository.findOne({ where: { id: userId } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to retrieve user: ${error.message}`,
      );
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    try {
      let copiedWish = new Wish();
      copiedWish = Object.assign(copiedWish, wishToCopy);
      copiedWish.offers = [];
      copiedWish.wishlists = [];
      copiedWish.owner = user;
      copiedWish.id = undefined;
      copiedWish.copied = wishToCopy.copied ? wishToCopy.copied + 1 : 1;

      return this.wishRepository.save(copiedWish);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to copy wish: ${error.message}`,
      );
    }
  }

  async calculateRaised(id: number): Promise<number> {
    let wish: Wish | undefined;
    try {
      wish = await this.getWishByIdWithOwnerOffersAndWishlists(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    let total = 0;
    for (const offer of wish.offers) {
      total += offer.amount;
    }
    return total;
  }

  async updateRaised(id: number): Promise<Wish> {
    let wish: Wish | undefined;
    try {
      wish = await this.getWishByIdWithOwnerOffersAndWishlists(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    wish.raised = await this.calculateRaised(id);
    return await this.wishRepository.save(wish);
  }

  async removeWish(id: number) {
    let wish: Wish | undefined;
    try {
      wish = await this.wishRepository.findOne({
        where: { id: id },
        relations: ['wishlists'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wish) {
      throw new NotFoundException(`Wish with ID ${id} not found.`);
    }
    try {
      wish.wishlists = [];
      await this.wishRepository.save(wish);
      await this.wishRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
