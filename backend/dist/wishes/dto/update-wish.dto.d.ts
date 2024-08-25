import { CreateWishDto } from './create-wish.dto';
declare const UpdateWishDto_base: import("@nestjs/common").Type<Partial<CreateWishDto>>;
export declare class UpdateWishDto extends UpdateWishDto_base {
    name?: string;
    link?: string;
    image?: string;
    price?: number;
    description?: string;
}
export {};
