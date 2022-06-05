import { EntityManager, EntityRepository, Repository } from 'typeorm'
import { ITransactionRepository } from '../utils/interfaces/repos.interfaces'
import Transaction from '../entities/transaction.entity'
import { CreateTransactionDto } from 'src/utils/dtos/transaction.dto'

@EntityRepository(Transaction)
export default class TransactionRepository
    extends Repository<Transaction>
    implements ITransactionRepository
{
    async createAndSave(
        createTransactionDto: CreateTransactionDto,
        manager?: EntityManager
    ) {
        let transaction = this.create(createTransactionDto)

        if (manager) {
            await manager.save(Transaction, transaction)
            return transaction
        }
        transaction = await this.save(transaction)

        return transaction
    }

    async findById(id: string) {
        const transaction = await this.findOne({
            id: Number(id),
        })
        return transaction
    }
}
