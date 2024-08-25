import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { GetUserByUsernameDto } from './dto/get-user-by-username.dto';
export declare class UsersService {
    private readonly UserRepository;
    private readonly WishRepository;
    constructor(UserRepository: Repository<User>, WishRepository: Repository<Wish>);
    private hashPassword;
    private isEmail;
    create(createUserDto: CreateUserDto): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    getUserById(id: number): Promise<User>;
    getPartialUserByUsername(username: string): Promise<GetUserByUsernameDto>;
    getWishesForLoggedUserWithOwnersAndOffers(username: string): Promise<Wish[]>;
    updateUserInfo(id: number, newUserData: UpdateUserDto): Promise<User>;
    findMany(query: any): Promise<User[]>;
}
