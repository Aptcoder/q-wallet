/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Generated,
    ManyToOne,
    BaseEntity,
} from 'typeorm'
import Account from './account.entity'
import User from './user.entity'

export enum TransactionType {
    DEBIT = 'debit',
    CREDIT = 'credit',
}

export enum TransactionCategory {
    WALLET_TRANSFER = 'wallet_transfer',
    CARD_FUNDING = 'card_funding',
    TRANSFER_FUNDING = 'transfer_funding',
    WITHDRAWAL = 'withdrawal',
}

@Entity()
export default class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type: 'enum',
        enum: TransactionType,
        nullable: false,
    })
    type!: TransactionType

    @Column({
        nullable: true,
    })
    ext_reference!: string

    @Column({
        nullable: true,
    })
    last_ext_response!: string

    @Column({
        type: 'enum',
        enum: TransactionCategory,
    })
    category!: TransactionCategory

    @Column()
    meta_data!: string

    @Column()
    @Generated('uuid')
    reference!: string

    @Column()
    narration!: string

    @ManyToOne(() => Account, {
        nullable: false,
        cascade: true,
    })
    account!: Account

    @Column({ nullable: false })
    accountId!: number

    @Column({
        type: 'numeric',
        precision: 20,
        scale: 4,
        nullable: false,
    })
    balance_before!: number

    @Column({
        type: 'numeric',
        precision: 20,
        scale: 4,
        nullable: false,
    })
    balance_after!: number

    @Column({
        type: 'numeric',
        precision: 20,
        scale: 4,
        nullable: false,
    })
    amount!: number
}
