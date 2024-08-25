import { BaseEntity } from '../../common/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
export declare class Wish extends BaseEntity {
    owner: User;
    offers: Offer[];
    wishlists: Wishlist[];
    name: string;
    link: string;
    image: string;
    price: number;
    raised: number;
    description: string;
    copied: number;
}
