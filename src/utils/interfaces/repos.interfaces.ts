/* eslint-disable no-unused-vars */
export interface IAccountRepository {
  findOne(options: object): any
  update(options: object, updates: object): any
}