import {
    BaseEntity,
    Column,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import User from './user.entity'

export default class Beneficiary extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Index()
    @Column({ nullable: false })
    userId!: number

    @ManyToOne(() => User, {
        nullable: false,
    })
    user!: User

    @Column({
        nullable: false,
    })
    bank_account!: string

    @Column({
        nullable: true,
    })
    account_name!: string

    @Column({
        nullable: false,
    })
    bank_name!: string
}
