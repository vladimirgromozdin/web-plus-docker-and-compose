import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
export declare class OffersService {
    private readonly offerRepository;
    private readonly wishRepository;
    constructor(offerRepository: Repository<Offer>, wishRepository: Repository<Wish>);
    createOffer(userId: any, createOfferDto: CreateOfferDto): Promise<Offer>;
    getAllOffersWithUsersAndItems(): Promise<Offer[]>;
    getOfferByIdWithUsersAndItems(id: number): Promise<Offer>;
}
