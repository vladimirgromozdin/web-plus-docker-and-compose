import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-many.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findMany(FindUsersDto: FindUsersDto): Promise<import("./entities/user.entity").User[]>;
    getLoggedUserData(req: any): Promise<import("./entities/user.entity").User>;
    getWishesForLoggedUserWithOwnersAndOffers(username: string): Promise<import("../wishes/entities/wish.entity").Wish[]>;
    getWishesForOtherUsersWithOwnersAndOffers(username: string): Promise<import("../wishes/entities/wish.entity").Wish[]>;
    findOne(username: string): Promise<import("./dto/get-user-by-username.dto").GetUserByUsernameDto>;
    updateUserInfo(req: any, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
}
