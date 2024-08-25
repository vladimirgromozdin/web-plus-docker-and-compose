import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { GetUserByUsernameDto } from './dto/get-user-by-username.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly WishRepository: Repository<Wish>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private isEmail(query: string) {
    return /\S+@\S+\.\S+/.test(query);
  }

  async create(createUserDto: CreateUserDto) {
    let user: User | undefined;
    const existingUser = await this.UserRepository.findOne({
      where: [
        {
          username: createUserDto.username,
        },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new BadRequestException(
        'User with this email or username already exists',
      );
    }
    try {
      user = this.UserRepository.create(createUserDto);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      return this.UserRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserByUsername(username: string) {
    let user: User | undefined;
    try {
      user = await this.UserRepository.findOne({
        where: { username: username },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${username} not found`);
    }
    return user;
  }

  async getUserById(id: number) {
    let user: User | undefined;
    try {
      user = await this.UserRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  async getPartialUserByUsername(
    username: string,
  ): Promise<GetUserByUsernameDto> {
    let user: User | undefined;
    try {
      user = await this.UserRepository.findOne({
        where: { username: username },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch user: ${error.message}`,
      );
    }
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as GetUserByUsernameDto;
  }

  async getWishesForLoggedUserWithOwnersAndOffers(username: string) {
    let wishes: Wish[] | undefined;
    try {
      wishes = await this.WishRepository.find({
        where: { owner: { username: username } },
        relations: ['owner', 'offers'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch wishes: ${error.message}`,
      );
    }
    return wishes;
  }

  async updateUserInfo(id: number, newUserData: UpdateUserDto) {
    let currentUser: User | undefined;
    const existingUser = await this.UserRepository.findOne({
      where: [
        {
          username: newUserData.username,
          id: Not(id),
        },
        {
          email: newUserData.email,
          id: Not(id),
        },
      ],
    });
    if (existingUser) {
      throw new BadRequestException(
        'User with this username or email already exists',
      );
    }
    try {
      currentUser = await this.UserRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch user due to an error: ${error.message}`,
      );
    }
    if (!currentUser) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    if (newUserData.password) {
      newUserData.password = await this.hashPassword(newUserData.password);
    }
    Object.assign(currentUser, newUserData);
    await this.UserRepository.save(currentUser);
    return currentUser;
  }

  async findMany(query) {
    let users: User[] | undefined;
    if (this.isEmail(query)) {
      try {
        users = await this.UserRepository.find({ where: { email: query } });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      try {
        users = await this.UserRepository.find({ where: { username: query } });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
    if (!users || users.length === 0) {
      throw new NotFoundException(`No users found.`);
    }
    return users;
  }
}
