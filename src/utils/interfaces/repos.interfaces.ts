import User from "../../entities/user.entity"
import { CreateUserDto } from "../dtos/users.dto"

/* eslint-disable no-unused-vars */
export interface IAccountRepository {
  findOne(options: object): any
  update(options: object, updates: object): any

}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | undefined >
  create(createUserDto: CreateUserDto): User
  save(user: User): Promise<User>
}