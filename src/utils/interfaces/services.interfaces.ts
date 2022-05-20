/* eslint-disable no-unused-vars */
import { TransactionCategory } from '../../entities/transaction.entity'
import { EntityManager } from 'typeorm'
import Account from '../../entities/account.entity'
import { AuthUserDto, CreateUserDto } from '../dtos/users.dto'

export interface IUserService {
    create(createUserDto: CreateUserDto): any
    auth(authUserDto: AuthUserDto): any
    // getOne(userId: string): any
    _comparePassword(inputPass: string, password: string): Promise<boolean>
    _generateToken(user: object): Promise<{ accessToken: string }>
}

export interface IAccountService {
    getBalance(userId: string): Promise<number>
    transfer(
        creditUserId: string,
        debitUserId: string,
        amount: number,
        narration?: string
    ): Promise<Account>
    creditAccount(
        userId: string,
        creditAccount: number,
        manager?: EntityManager,
        transactionDetails?: {
            narration: string
            category: TransactionCategory
        }
    ): Promise<Account>
    debitAccount(
        userId: string,
        creditAccount: number,
        manager?: EntityManager,
        transactionDetails?: {
            narration: string
            category: TransactionCategory
        }
    ): Promise<Account>
}
