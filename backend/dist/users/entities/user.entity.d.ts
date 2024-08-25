import { BaseEntity } from '../../common/entities/BaseEntity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';
export declare class User extends BaseEntity {
    username: string;
    about: string;
    avatar: string;
    email: string;
    password: string;
    offers: Offer[];
    wishes: Wish[];
    wishlists: Wishlist[];
}
