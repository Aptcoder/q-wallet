import {
  Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn
} from 'typeorm';
import User from './user.entity';

@Entity()
export default class Account {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 4,
    default: 0,
    nullable: false
  })
    balance!: number;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.account, {
    nullable: false
  })
    user!: User;
}
