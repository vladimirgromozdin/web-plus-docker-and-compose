import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createOffer(userId, createOfferDto: CreateOfferDto) {
    let wish: Wish | undefined;
    try {
      wish = await this.wishRepository.findOne({
        where: { id: createOfferDto.itemId },
        relations: ['owner'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!wish) {
      throw new NotFoundException(
        `Wish with ID ${createOfferDto.itemId} not found`,
      );
    }
    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'User cannot make an offer for their own wish',
      );
    }
    try {
      const offer = this.offerRepository.create(createOfferDto);
      return await this.offerRepository.save(offer);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllOffersWithUsersAndItems() {
    try {
      return await this.offerRepository.find({ relations: ['user', 'item'] });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch offers: ${error.message}`,
      );
    }
  }

  async getOfferByIdWithUsersAndItems(id: number) {
    let offer: Offer | undefined;
    try {
      offer = await this.offerRepository.findOne({
        where: { id },
        relations: ['user', 'item'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch offer due to an error: ${error.message}`,
      );
    }
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found.`);
    }
    return offer;
  }
}
