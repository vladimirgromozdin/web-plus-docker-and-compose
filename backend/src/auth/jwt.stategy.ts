import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }
  async validate(jwtPayload: { sub: number }) {
    let user: User | undefined;
    try {
      user = await this.usersService.getUserById(jwtPayload.sub);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!user) {
      throw new UnauthorizedException(`Sorry, we don't recognize you.`);
    }

    return user;
  }
}
