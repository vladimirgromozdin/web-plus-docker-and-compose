import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    createOffer(req: any, createOfferDto: CreateOfferDto): Promise<import("./entities/offer.entity").Offer>;
    getAllOffersWithUsersAndItems(): Promise<import("./entities/offer.entity").Offer[]>;
    getOfferByIdWithUsersAndItems(id: number): Promise<import("./entities/offer.entity").Offer>;
}
