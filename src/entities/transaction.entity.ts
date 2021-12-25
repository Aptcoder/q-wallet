/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import {
  Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, Generated, ManyToOne, BaseEntity
} from 'typeorm';
import Account from './account.entity';
import User from './user.entity';

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export enum TransactionCategory {
  WALLET_TRANSFER = 'wallet_transfer',
  CARD_FUNDING = 'card_funding'
}

@Entity()
export default class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false
  })
    type!: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionCategory,
  })
    category!: TransactionCategory;

  @Column()
    meta_data!: string;

  @Column()
  @Generated('uuid')
    reference!: string;

  @Column()
    narration!: string;

  @ManyToOne(() => Account, {
    nullable: false,
    cascade: true
  })
    account!: Account;

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
}
