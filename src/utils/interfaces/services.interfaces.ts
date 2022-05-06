/* eslint-disable no-unused-vars */
import { AuthUserDto, CreateUserDto } from '../dtos/users.dto';

export interface IUsersService {
  create(createUserDto: CreateUserDto): any,
  auth(authUserDto: AuthUserDto): any,
  getOne(userId: string): any
}
