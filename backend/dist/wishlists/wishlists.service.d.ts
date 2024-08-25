import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
export declare class WishlistsService {
    private readonly wishlistRepository;
    private readonly userRepository;
    private readonly WishesService;
    constructor(wishlistRepository: Repository<Wishlist>, userRepository: Repository<User>, WishesService: WishesService);
    createWishlist(userId: number, createWishlistDto: CreateWishlistDto): Promise<Wishlist>;
    getAllWishlistsWithOwnersAndItems(): Promise<Wishlist[]>;
    getWishlistByIdWithOwnerAndItems(id: number): Promise<Wishlist>;
    updateWishlist(id: number, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist>;
    removeWishlist(id: number): Promise<void>;
}
