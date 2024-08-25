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
exports.WishesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wish_entity_1 = require("./entities/wish.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let WishesService = class WishesService {
    constructor(wishRepository, userRepository) {
        this.wishRepository = wishRepository;
        this.userRepository = userRepository;
    }
    async createWish(createWishDto) {
        try {
            const wish = this.wishRepository.create(createWishDto);
            return this.wishRepository.save(wish);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getRecentWishes() {
        try {
            return await this.wishRepository.find({
                order: { createdAt: 'DESC' },
                take: 40,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve recent 40 wishes: ${error.message}`);
        }
    }
    async getMostPopularWishes() {
        try {
            return await this.wishRepository.find({
                order: { copied: 'DESC' },
                take: 10,
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve 10 most copied wishes: ${error.message}`);
        }
    }
    async getWishByIdWithOwnerOffersAndWishlists(id) {
        let wish;
        try {
            wish = await this.wishRepository.findOne({
                where: { id },
                relations: ['owner', 'offers', 'wishlists'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch offer due to an error: ${error.message}`);
        }
        if (!wish) {
            throw new common_1.NotFoundException(`Wish with ID ${id} not found.`);
        }
        return wish;
    }
    async updateWishInfo(id, newWishData) {
        let wishToUpdate;
        try {
            wishToUpdate = await this.wishRepository.findOne({ where: { id: id } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch wish due to an error: ${error.message}`);
        }
        if (!wishToUpdate) {
            throw new common_1.NotFoundException(`Wish with ID ${id} not found.`);
        }
        if (wishToUpdate.raised > 0) {
            throw new common_1.BadRequestException('Cannot change the price of a wish since money has been raised');
        }
        Object.assign(wishToUpdate, newWishData);
        await this.wishRepository.save(wishToUpdate);
        return wishToUpdate;
    }
    async copyWishToUser(wishId, userId) {
        let wishToCopy;
        let user;
        try {
            wishToCopy = await this.getWishByIdWithOwnerOffersAndWishlists(wishId);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve wish: ${error.message}`);
        }
        if (!wishToCopy) {
            throw new common_1.NotFoundException(`Wish with ID ${wishId} not found.`);
        }
        try {
            user = await this.userRepository.findOne({ where: { id: userId } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to retrieve user: ${error.message}`);
        }
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found.`);
        }
        try {
            let copiedWish = new wish_entity_1.Wish();
            copiedWish = Object.assign(copiedWish, wishToCopy);
            copiedWish.offers = [];
            copiedWish.wishlists = [];
            copiedWish.owner = user;
            copiedWish.id = undefined;
            copiedWish.copied = wishToCopy.copied ? wishToCopy.copied + 1 : 1;
            return this.wishRepository.save(copiedWish);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to copy wish: ${error.message}`);
        }
    }
    async calculateRaised(id) {
        let wish;
        try {
            wish = await this.getWishByIdWithOwnerOffersAndWishlists(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException();
        }
        if (!wish) {
            throw new common_1.NotFoundException('Wish not found');
        }
        let total = 0;
        for (const offer of wish.offers) {
            total += offer.amount;
        }
        return total;
    }
    async updateRaised(id) {
        let wish;
        try {
            wish = await this.getWishByIdWithOwnerOffersAndWishlists(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!wish) {
            throw new common_1.NotFoundException('Wish not found');
        }
        wish.raised = await this.calculateRaised(id);
        return await this.wishRepository.save(wish);
    }
    async removeWish(id) {
        let wish;
        try {
            wish = await this.wishRepository.findOne({
                where: { id: id },
                relations: ['wishlists'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!wish) {
            throw new common_1.NotFoundException(`Wish with ID ${id} not found.`);
        }
        try {
            wish.wishlists = [];
            await this.wishRepository.save(wish);
            await this.wishRepository.delete(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
WishesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wish_entity_1.Wish)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WishesService);
exports.WishesService = WishesService;
//# sourceMappingURL=wishes.service.js.map