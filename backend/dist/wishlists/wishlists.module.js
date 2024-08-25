"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistsModule = void 0;
const common_1 = require("@nestjs/common");
const wishlists_service_1 = require("./wishlists.service");
const wishlists_controller_1 = require("./wishlists.controller");
const typeorm_1 = require("@nestjs/typeorm");
const wishlist_entity_1 = require("./entities/wishlist.entity");
const user_entity_1 = require("../users/entities/user.entity");
const wish_entity_1 = require("../wishes/entities/wish.entity");
const wishes_service_1 = require("../wishes/wishes.service");
let WishlistsModule = class WishlistsModule {
};
WishlistsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wishlist_entity_1.Wishlist, user_entity_1.User, wish_entity_1.Wish])],
        controllers: [wishlists_controller_1.WishlistsController],
        providers: [wishlists_service_1.WishlistsService, wishes_service_1.WishesService],
    })
], WishlistsModule);
exports.WishlistsModule = WishlistsModule;
//# sourceMappingURL=wishlists.module.js.map