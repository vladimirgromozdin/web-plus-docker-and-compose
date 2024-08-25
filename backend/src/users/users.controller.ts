import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-many.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  findMany(@Body() FindUsersDto: FindUsersDto) {
    return this.usersService.findMany(FindUsersDto.query);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  getLoggedUserData(@Req() req) {
    const id = req.user.id;
    return this.usersService.getUserById(id);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getWishesForLoggedUserWithOwnersAndOffers(
    @Param('username') username: string,
  ) {
    return this.usersService.getWishesForLoggedUserWithOwnersAndOffers(
      username,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getWishesForOtherUsersWithOwnersAndOffers(
    @Param('username') username: string,
  ) {
    return this.usersService.getWishesForLoggedUserWithOwnersAndOffers(
      username,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.getPartialUserByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  updateUserInfo(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    return this.usersService.updateUserInfo(id, updateUserDto);
  }
}
