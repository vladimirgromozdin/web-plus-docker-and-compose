"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const wish_entity_1 = require("../wishes/entities/wish.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(UserRepository, WishRepository) {
        this.UserRepository = UserRepository;
        this.WishRepository = WishRepository;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    isEmail(query) {
        return /\S+@\S+\.\S+/.test(query);
    }
    async create(createUserDto) {
        let user;
        const existingUser = await this.UserRepository.findOne({
            where: [
                {
                    username: createUserDto.username,
                },
                { email: createUserDto.email },
            ],
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email or username already exists');
        }
        try {
            user = this.UserRepository.create(createUserDto);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            return this.UserRepository.save(user);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getUserByUsername(username) {
        let user;
        try {
            user = await this.UserRepository.findOne({
                where: { username: username },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${username} not found`);
        }
        return user;
    }
    async getUserById(id) {
        let user;
        try {
            user = await this.UserRepository.findOne({ where: { id: id } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found.`);
        }
        return user;
    }
    async getPartialUserByUsername(username) {
        let user;
        try {
            user = await this.UserRepository.findOne({
                where: { username: username },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch user: ${error.message}`);
        }
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return {
            id: user.id,
            username: user.username,
            about: user.about,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async getWishesForLoggedUserWithOwnersAndOffers(username) {
        let wishes;
        try {
            wishes = await this.WishRepository.find({
                where: { owner: { username: username } },
                relations: ['owner', 'offers'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch wishes: ${error.message}`);
        }
        return wishes;
    }
    async updateUserInfo(id, newUserData) {
        let currentUser;
        const existingUser = await this.UserRepository.findOne({
            where: [
                {
                    username: newUserData.username,
                    id: (0, typeorm_2.Not)(id),
                },
                {
                    email: newUserData.email,
                    id: (0, typeorm_2.Not)(id),
                },
            ],
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this username or email already exists');
        }
        try {
            currentUser = await this.UserRepository.findOne({ where: { id: id } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch user due to an error: ${error.message}`);
        }
        if (!currentUser) {
            throw new common_1.NotFoundException(`User with id ${id} not found.`);
        }
        if (newUserData.password) {
            newUserData.password = await this.hashPassword(newUserData.password);
        }
        Object.assign(currentUser, newUserData);
        await this.UserRepository.save(currentUser);
        return currentUser;
    }
    async findMany(query) {
        let users;
        if (this.isEmail(query)) {
            try {
                users = await this.UserRepository.find({ where: { email: query } });
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        }
        else {
            try {
                users = await this.UserRepository.find({ where: { username: query } });
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        }
        if (!users || users.length === 0) {
            throw new common_1.NotFoundException(`No users found.`);
        }
        return users;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(wish_entity_1.Wish)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map