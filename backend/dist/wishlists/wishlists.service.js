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
exports.WishlistsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wishlist_entity_1 = require("./entities/wishlist.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const wishes_service_1 = require("../wishes/wishes.service");
let WishlistsService = class WishlistsService {
    constructor(wishlistRepository, userRepository, WishesService) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.WishesService = WishesService;
    }
    async createWishlist(userId, createWishlistDto) {
        let user;
        try {
            user = await this.userRepository.findOne({ where: { id: userId } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const { name, image, itemsId } = createWishlistDto;
        const newWishlist = this.wishlistRepository.create();
        newWishlist.name = name;
        newWishlist.image = image;
        newWishlist.owner = user;
        const items = [];
        for (const id of itemsId) {
            try {
                const wish = await this.WishesService.getWishByIdWithOwnerOffersAndWishlists(id);
                items.push(wish);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        }
        newWishlist.items = items;
        try {
            await this.wishlistRepository.save(newWishlist);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return newWishlist;
    }
    async getAllWishlistsWithOwnersAndItems() {
        let wishlists;
        try {
            wishlists = await this.wishlistRepository.find({
                relations: ['owner', 'items'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch wishlists: ${error.message}`);
        }
        if (!wishlists.length) {
            throw new common_1.NotFoundException(`No wishlists found.`);
        }
        return wishlists;
    }
    async getWishlistByIdWithOwnerAndItems(id) {
        let wishlist;
        try {
            wishlist = await this.wishlistRepository.findOne({
                where: { id },
                relations: ['owner', 'items'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch wishlist: ${error.message}`);
        }
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist with ID ${id} not found.`);
        }
        return wishlist;
    }
    async updateWishlist(id, updateWishlistDto) {
        let wishlistToUpdate;
        try {
            wishlistToUpdate = await this.wishlistRepository.findOne({
                where: { id: id },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch wishlist due to an error: ${error.message}`);
        }
        if (!wishlistToUpdate) {
            throw new common_1.NotFoundException(`Wishlist with ID ${id} not found`);
        }
        Object.assign(wishlistToUpdate, updateWishlistDto);
        await this.wishlistRepository.save(wishlistToUpdate);
        return wishlistToUpdate;
    }
    async removeWishlist(id) {
        let wishlist;
        try {
            wishlist = await this.wishlistRepository.findOne({
                where: { id: id },
                relations: ['items'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!wishlist) {
            throw new common_1.NotFoundException(`Wishlist with ID ${id} not found.`);
        }
        try {
            wishlist.items = [];
            await this.wishlistRepository.save(wishlist);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to update Wishlist with ID ${id}`);
        }
        try {
            await this.wishlistRepository.delete(id);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(`Failed to delete Wishlist with ID ${id}`);
        }
    }
};
WishlistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wishlist_entity_1.Wishlist)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        wishes_service_1.WishesService])
], WishlistsService);
exports.WishlistsService = WishlistsService;
//# sourceMappingURL=wishlists.service.js.map