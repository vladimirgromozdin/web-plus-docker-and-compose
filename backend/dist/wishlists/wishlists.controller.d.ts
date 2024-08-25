import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
export declare class WishlistsController {
    private readonly wishlistsService;
    constructor(wishlistsService: WishlistsService);
    create(req: any, createWishlistDto: CreateWishlistDto): Promise<Wishlist>;
    getAllWishlistsWithOwnersAndItems(): Promise<Wishlist[]>;
    getWishlistByIdWithOwnerAndItems(id: string): Promise<Wishlist>;
    updateWishlist(req: any, id: string, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist>;
    removeWishlist(req: any, id: string): Promise<void>;
}
