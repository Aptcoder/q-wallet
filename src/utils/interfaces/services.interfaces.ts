/* eslint-disable no-unused-vars */
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
}
