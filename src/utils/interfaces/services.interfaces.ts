/* eslint-disable no-unused-vars */
import { AuthUserDto, CreateUserDto } from '../dtos/users.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): any,
  auth(authUserDto: AuthUserDto): any,
  // getOne(userId: string): any
  _comparePassword(inputPass: string, password: string): Promise<boolean>
  _generateToken(user: object): Promise<{ accessToken: string }>
}

export interface IAccountService {
  getBalance(userId: string): Promise<number>
}