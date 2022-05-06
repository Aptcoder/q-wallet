import { EntityRepository, Repository } from 'typeorm';
import { IAccountRepository } from '../utils/interfaces/repos.interfaces';
import Account from '../entities/account.entity';

@EntityRepository(Account)
export default class AccountsRepository extends Repository<Account> implements IAccountRepository {
}
