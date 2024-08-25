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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const offer_entity_1 = require("./entities/offer.entity");
const typeorm_2 = require("typeorm");
const wish_entity_1 = require("../wishes/entities/wish.entity");
let OffersService = class OffersService {
    constructor(offerRepository, wishRepository) {
        this.offerRepository = offerRepository;
        this.wishRepository = wishRepository;
    }
    async createOffer(userId, createOfferDto) {
        let wish;
        try {
            wish = await this.wishRepository.findOne({
                where: { id: createOfferDto.itemId },
                relations: ['owner'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!wish) {
            throw new common_1.NotFoundException(`Wish with ID ${createOfferDto.itemId} not found`);
        }
        if (wish.owner.id === userId) {
            throw new common_1.ForbiddenException('User cannot make an offer for their own wish');
        }
        try {
            const offer = this.offerRepository.create(createOfferDto);
            return await this.offerRepository.save(offer);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getAllOffersWithUsersAndItems() {
        try {
            return await this.offerRepository.find({ relations: ['user', 'item'] });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch offers: ${error.message}`);
        }
    }
    async getOfferByIdWithUsersAndItems(id) {
        let offer;
        try {
            offer = await this.offerRepository.findOne({
                where: { id },
                relations: ['user', 'item'],
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to fetch offer due to an error: ${error.message}`);
        }
        if (!offer) {
            throw new common_1.NotFoundException(`Offer with ID ${id} not found.`);
        }
        return offer;
    }
};
OffersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(offer_entity_1.Offer)),
    __param(1, (0, typeorm_1.InjectRepository)(wish_entity_1.Wish)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OffersService);
exports.OffersService = OffersService;
//# sourceMappingURL=offers.service.js.map