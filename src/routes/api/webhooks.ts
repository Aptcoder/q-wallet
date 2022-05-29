import { Router } from 'express'
import TransactionRepository from '../../repositories/transaction.repository'
import AccountService from '../../services/account.services'
import { getConnection, getConnectionManager, getManager } from 'typeorm'
import AccountRepository from '../../repositories/account.repository'
import PaymentService from '../../services/payment.service'
import User from '../../entities/user.entity'
import { TransactionCategory } from '../../entities/transaction.entity'
import BeneficiaryRepository from '../../repositories/beneficiary.repository'

const webhookRouter = Router()

webhookRouter.post('/flutterwave', async (req, res) => {
    const secretHash = process.env.FLW_SECRET_HASH
    const signature = req.headers['verif-hash']
    if (!signature || signature !== secretHash) {
        return res.status(401).send()
    }

    try {
        const payload = req.body
        console.log(payload)
        if (payload.event == 'charge.completed') {
            const connection = getConnection('q-wallet')
            const accountRepository =
                connection.getCustomRepository(AccountRepository)
            const transactionRepository = connection.getCustomRepository(
                TransactionRepository
            )
            const beneficiaryRepository = getConnection(
                'q-wallet'
            ).getCustomRepository(BeneficiaryRepository)

            const paymentService = new PaymentService()

            const accountService = new AccountService(
                accountRepository,
                transactionRepository,
                paymentService,
                beneficiaryRepository
            )
            return await connection.transaction(async (manager) => {
                const user = await manager.findOne(User, {
                    where: {
                        email: payload.data.customer.email,
                    },
                })

                if (!user) {
                    return Promise.reject('user not found')
                }
                let narration = 'wallet deposit'
                // let category
                if (payload.data.payment_type == 'bank_transfer') {
                    narration = 'Wallet deposit by bank transfer'
                }
                const account = await accountService.creditAccount(
                    String(user.id),
                    payload.data.amount,
                    manager,
                    {
                        narration,
                        ext_reference: payload.data.tx_ref,
                        category: TransactionCategory.TRANSFER_FUNDING,
                    }
                )
                res.send('Thanks')
                return Promise.resolve()
            })
        }

        return res.send('Thanks anyways')
    } catch (err) {
        console.log('err', err)
        return res.status(400).send(err)
    }
})

export default webhookRouter
