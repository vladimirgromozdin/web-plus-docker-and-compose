import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
export declare class WishesController {
    private readonly wishesService;
    constructor(wishesService: WishesService);
    getRecentWishes(): Promise<Wish[]>;
    getMostPopularWishes(): Promise<Wish[]>;
    create(createWishDto: CreateWishDto): Promise<Wish>;
    findOne(id: string): Promise<Wish>;
    updateWishInfo(req: any, id: string, updateWishDto: UpdateWishDto): Promise<Wish>;
    removeWish(id: string): Promise<void>;
}
