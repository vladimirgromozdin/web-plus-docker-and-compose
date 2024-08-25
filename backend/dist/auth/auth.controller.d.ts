import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    signin(req: any): {
        access_token: string;
    };
    signup(createUserDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
}
