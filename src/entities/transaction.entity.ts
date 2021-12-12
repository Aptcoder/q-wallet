/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import {
  Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn
} from 'typeorm';
import User from './user.entity';

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

@Entity()
export default class Transaction {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
    type!: TransactionType;

  @Column()
    meta_data!: string;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 4,
    nullable: false
  })
    balance_before!: number;

    @Column({
      type: 'numeric',
      precision: 20,
      scale: 4,
      nullable: false
    })
      balance_after!: number;

      @Column({
        type: 'numeric',
        precision: 20,
        scale: 4,
        nullable: false
      })
        amount!: number;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.account, {
    nullable: false
  })
    user!: User;
}
