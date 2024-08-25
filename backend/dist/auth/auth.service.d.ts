import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    auth(user: User): {
        access_token: string;
    };
    validatePassword(username: string, password: string): Promise<{
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
