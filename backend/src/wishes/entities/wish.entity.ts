import { BaseEntity } from '../../common/entities/BaseEntity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { MaxLength } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  @Column()
  @MaxLength(250)
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column({ nullable: true, default: 0 })
  raised: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  copied: number;
}
