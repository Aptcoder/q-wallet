import Transaction from '../../entities/transaction.entity'
import { EntityManager } from 'typeorm'
import Account from '../../entities/account.entity'
import User from '../../entities/user.entity'
import { CreateTransactionDto } from '../dtos/transaction.dto'
import { CreateUserDto } from '../dtos/users.dto'
import { CreateBeneficiaryDto } from '../dtos/beneficiary.dto'
import Beneficiary from 'src/entities/beneficiary.entity'
import { IBeneficiary } from './entities.interfaces'

/* eslint-disable no-unused-vars */
export interface IAccountRepository {
    findOne(options: object): any
    update(options: object, updates: object): any
    findByUserId(userId: string): Promise<Account | undefined>
    findByUserId(
        userId: string,
        manager?: EntityManager,
        lock?: boolean
    ): Promise<Account | undefined>
    updateBalance(
        account: Account,
        amount: number,
        type: 'inc' | 'dec',
        manager?: EntityManager
    ): Promise<Account>
    manager: {
        transaction: (callback: () => Promise<any>) => void
    }
}

export interface IUserRepository {
    findByEmail(email: string): Promise<User | undefined>
    create(createUserDto: CreateUserDto): User
    save(user: User): Promise<User>
}

export interface ITransactionRepository {
    createAndSave(
        createTransactionDto: Partial<CreateTransactionDto>,
        manager?: EntityManager
    ): Promise<Transaction>
}

export interface IBeneficiaryRepository {
    createAndSave(
        createBeneficiaryDto: CreateBeneficiaryDto,
        manager?: EntityManager
    ): Promise<{}>
    findByUserId(userId: string): Promise<any[]>
    findOneWithUserId(
        userId: string,
        beneficiaryId: string
    ): Promise<IBeneficiary | undefined>
    findOneWithUserIdAndAccount(
        userId: string,
        account_number: string
    ): Promise<IBeneficiary | undefined>
}
