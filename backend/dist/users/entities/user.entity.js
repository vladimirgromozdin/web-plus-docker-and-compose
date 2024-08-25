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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const BaseEntity_1 = require("../../common/entities/BaseEntity");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const wish_entity_1 = require("../../wishes/entities/wish.entity");
const wishlist_entity_1 = require("../../wishlists/entities/wishlist.entity");
const offer_entity_1 = require("../../offers/entities/offer.entity");
let User = class User extends BaseEntity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
    }),
    (0, class_validator_1.Length)(2, 30),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'Пока ничего не рассказал о себе',
    }),
    (0, class_validator_1.Length)(2, 200),
    __metadata("design:type", String)
], User.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'https://i.pravatar.cc/300',
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => offer_entity_1.Offer, (offer) => offer.user),
    __metadata("design:type", Array)
], User.prototype, "offers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wish_entity_1.Wish, (wish) => wish.owner),
    __metadata("design:type", Array)
], User.prototype, "wishes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wishlist_entity_1.Wishlist, (wishlist) => wishlist.owner),
    __metadata("design:type", Array)
], User.prototype, "wishlists", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map