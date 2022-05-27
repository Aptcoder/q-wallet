import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import User from './user.entity'

@Entity()
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
        unique: true,
    })
    bank_account!: string

    @Column({
        nullable: true,
    })
    account_name!: string

    @Column({
        nullable: false,
    })
    bank_code!: string
}
