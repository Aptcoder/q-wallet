/* eslint-disable no-unused-vars */
import { AuthUserDto, CreateUserDto } from '../dtos/users.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): any,
  // auth(authUserDto: AuthUserDto): any,
  // getOne(userId: string): any
}
