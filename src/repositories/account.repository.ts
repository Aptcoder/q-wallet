import { EntityManager, EntityRepository, Repository } from 'typeorm'
import { IAccountRepository } from '../utils/interfaces/repos.interfaces'
import Account from '../entities/account.entity'

@EntityRepository(Account)
export default class AccountRepository
    extends Repository<Account>
    implements IAccountRepository
{
    async findByUserId(userId: string, manager?: EntityManager, lock = false) {
        let query
        if (manager) {
            query = manager
                .createQueryBuilder(Account, 'account')
                .where({ userId: userId })
            if (lock) {
                query = query.setLock('pessimistic_read')
            }
        } else {
            query = this.createQueryBuilder().where({
                userId,
            })
        }
        const account = await query.getOne()
        return account
    }

    async updateBalance(
        account: Account,
        amount: number,
        type: 'inc' | 'dec',
        manager?: EntityManager
    ) {
        if (type === 'inc') {
            account.balance = account.balance + Number(amount)
        } else {
            account.balance = account.balance - Number(amount)
        }

        if (manager) {
            account = await manager.save(Account, account)
            return account
        }
        account = await this.save(account)
        return account
    }
}
