import { BaseEntity } from '../../common/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
export declare class Offer extends BaseEntity {
    user: User;
    item: Wish;
    amount: number;
    hidden: boolean;
}
