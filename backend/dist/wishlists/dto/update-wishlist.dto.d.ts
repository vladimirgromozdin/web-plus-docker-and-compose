import { CreateWishlistDto } from './create-wishlist.dto';
declare const UpdateWishlistDto_base: import("@nestjs/common").Type<Partial<CreateWishlistDto>>;
export declare class UpdateWishlistDto extends UpdateWishlistDto_base {
    name?: string;
    image?: string;
    itemsId?: number[];
}
export {};
