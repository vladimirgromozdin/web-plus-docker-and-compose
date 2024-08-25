import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {UsersModule} from './users/users.module';
import {WishesModule} from './wishes/wishes.module';
import {WishlistsModule} from './wishlists/wishlists.module';
import {OffersModule} from './offers/offers.module';
import {BaseEntity} from './common/entities/BaseEntity';
import {User} from './users/entities/user.entity';
import {Offer} from './offers/entities/offer.entity';
import {Wishlist} from './wishlists/entities/wishlist.entity';
import {Wish} from './wishes/entities/wish.entity';
import {AuthModule} from './auth/auth.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {resolve} from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: resolve(__dirname, '../../.env')
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: configService.get('DATABASE_PORT'),
                username: configService.get('DATABASE_USER'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [BaseEntity, User, Offer, Wish, Wishlist],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        WishesModule,
        WishlistsModule,
        OffersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
