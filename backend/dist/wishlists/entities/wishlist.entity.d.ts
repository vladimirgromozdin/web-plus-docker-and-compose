import { BaseEntity } from '../../common/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
export declare class Wishlist extends BaseEntity {
    items: Wish[];
    owner: User;
    name: string;
    image: string;
}
