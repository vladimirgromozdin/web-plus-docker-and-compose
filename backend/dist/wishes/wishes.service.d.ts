import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class WishesService {
    private readonly wishRepository;
    private readonly userRepository;
    constructor(wishRepository: Repository<Wish>, userRepository: Repository<User>);
    createWish(createWishDto: CreateWishDto): Promise<Wish>;
    getRecentWishes(): Promise<Wish[]>;
    getMostPopularWishes(): Promise<Wish[]>;
    getWishByIdWithOwnerOffersAndWishlists(id: number): Promise<Wish>;
    updateWishInfo(id: number, newWishData: UpdateWishDto): Promise<Wish>;
    copyWishToUser(wishId: number, userId: number): Promise<Wish>;
    calculateRaised(id: number): Promise<number>;
    updateRaised(id: number): Promise<Wish>;
    removeWish(id: number): Promise<void>;
}
