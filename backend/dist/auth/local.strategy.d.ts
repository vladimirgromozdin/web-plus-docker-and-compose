import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<{
        username: string;
        about: string;
        avatar: string;
        email: string;
        offers: import("../offers/entities/offer.entity").Offer[];
        wishes: import("../wishes/entities/wish.entity").Wish[];
        wishlists: import("../wishlists/entities/wishlist.entity").Wishlist[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
