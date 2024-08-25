import { BaseEntity } from '../../common/entities/BaseEntity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @ManyToMany(() => Wish, (wish) => wish.wishlists, { onDelete: 'CASCADE' })
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  image: string;

  // @Column()
  // @IsOptional()
  // @MaxLength(1500)
  // description: string;
}
