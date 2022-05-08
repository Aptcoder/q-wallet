import {
  Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, BaseEntity, Index
} from 'typeorm';
import User from './user.entity';

@Entity()
export default class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 4,
    default: 0,
    nullable: false,
    transformer: {
      to: (value) => value,
      from: (value): number => parseFloat(value)
    }
  })
    balance!: number;

  @Index()
  @Column({ nullable: false })
  userId!: number;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.account, {
    nullable: false
  })
    user!: User;
}
