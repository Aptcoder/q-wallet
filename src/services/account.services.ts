import { EntityManager } from 'typeorm'
import { randomUUID } from 'crypto'
import {
    IAccountRepository,
    IBeneficiaryRepository,
    ITransactionRepository,
} from 'src/utils/interfaces/repos.interfaces'
import Account from '../entities/account.entity'
import {
    TransactionType,
    TransactionCategory,
} from '../entities/transaction.entity'
import {
    IAccountService,
    IPaymentService,
} from '../utils/interfaces/services.interfaces'
import { APIError, ConflictError, NotFoundError } from '../utils/errors'
import AccountRepository from '../repositories/account.repository'
import { BankTransferDto } from '../utils/dtos/account.dto'
import FlutterwaveStrategy from './payment_strategies/flutterwave.strategy'
import config from 'config'
import PaystackStrategy from './payment_strategies/paystack.strategy'
import { getPaymentStrategy } from '../utils/helpers'

export default class AccountService implements IAccountService {
    constructor(
        private accountRepository: IAccountRepository,
        private transactionRepository: ITransactionRepository,
        private paymentService: IPaymentService,
        private beneficiaryRepository: IBeneficiaryRepository
    ) {
        this.accountRepository = accountRepository
        this.transactionRepository = transactionRepository
        this.paymentService = paymentService
        this.beneficiaryRepository = beneficiaryRepository
    }

    public async getBalance(userId: string) {
        const account: Account | undefined =
            await this.accountRepository.findOne({
                where: {
                    userId,
                },
            })
        if (!account) {
            throw new NotFoundError('Account not found')
        }
        return account.balance
    }

    public async reverseTransaction(transactionId: string) {
        const transaction = await this.transactionRepository.findById(
            transactionId
        )
        if (!transaction) {
            throw new NotFoundError('Transaction not found')
        }

        if (transaction.type === TransactionType.DEBIT) {
            const accountRepository = this
                .accountRepository as unknown as AccountRepository
            return accountRepository.manager.transaction(async (manager) => {
                return await this.creditAccount(
                    String(transaction.userId),
                    transaction.amount,
                    manager,
                    {
                        narration: 'Reversal',
                        category: TransactionCategory.WALLET_TRANSFER,
                    }
                )
            })
        } else {
            const accountRepository = this
                .accountRepository as unknown as AccountRepository
            return accountRepository.manager.transaction(async (manager) => {
                return await this.debitAccount(
                    String(transaction.userId),
                    transaction.amount,
                    manager,
                    {
                        narration: 'Reversal',
                        category: TransactionCategory.WALLET_TRANSFER,
                    }
                )
            })
        }
    }

    public async fundWithTransfer(
        bankTransferDto: BankTransferDto
    ): Promise<{}> {
        const tx_ref = randomUUID()
        const flw_strat = getPaymentStrategy('FLUTTERWAVE')
        this.paymentService.setStrategy(flw_strat)
        const result = await this.paymentService.chargeWithTransfer({
            reference: tx_ref,
            email: bankTransferDto.email,
            amount: bankTransferDto.amount,
        })

        if (!result.success) {
            throw new APIError('Could not intiate transfer', 500)
        }
        return result.data
    }

    public async creditAccount(
        userId: string,
        creditAmount: number,
        manager: EntityManager,
        transactionDetails: {
            narration: string
            category: TransactionCategory
            ext_reference?: string
        }
    ) {
        let account = await this.accountRepository.findByUserId(
            userId,
            manager,
            true
        )
        if (!account) {
            throw new NotFoundError('Credit account not found')
        }
        const oldBalance = account.balance

        account = await this.accountRepository.updateBalance(
            account,
            creditAmount,
            'inc',
            manager
        )
        const transactionData = {
            amount: creditAmount,
            type: TransactionType.CREDIT,
            userId: account.userId,
            meta_data: transactionDetails.narration,
            balance_after: account.balance,
            balance_before: oldBalance,
            ...transactionDetails,
        }
        await this.transactionRepository.createAndSave(transactionData, manager)

        return account
    }

    public async debitAccount(
        userId: string,
        debitAmount: number,
        manager: EntityManager,
        transactionDetails: { narration: string; category: TransactionCategory }
    ) {
        let account = await this.accountRepository.findByUserId(
            userId,
            manager,
            true
        )

        if (!account) {
            throw new NotFoundError('Debit account not found')
        }

        if (account.balance < debitAmount) {
            throw new ConflictError('Insufficient balance')
        }

        const oldBalance = account.balance

        account = await this.accountRepository.updateBalance(
            account,
            debitAmount,
            'dec',
            manager
        )
        const transactionData = {
            amount: debitAmount,
            type: TransactionType.DEBIT,
            userId: account.userId,
            meta_data: transactionDetails.narration,
            balance_after: account.balance,
            balance_before: oldBalance,
            ...transactionDetails,
        }
        await this.transactionRepository.createAndSave(transactionData, manager)

        return account
    }

    public async transfer(
        creditUserId: string,
        debitUserId: string,
        amount: number,
        narration: string
    ) {
        if (amount < 50) {
            throw new APIError('Amount can not be less than 50', 400)
        }
        if (creditUserId == debitUserId) {
            throw new APIError(
                'Debit user and credit user can not be the same',
                400
            )
        }
        const accountRepository = this
            .accountRepository as unknown as AccountRepository

        const account = await accountRepository.manager.transaction(
            async (manager) => {
                const transactionDetails = {
                    narration: narration ? `INT_TRF_${narration}` : 'INT_TEF',
                    category: TransactionCategory.WALLET_TRANSFER,
                }
                const creditAccount = await this.creditAccount(
                    creditUserId,
                    amount,
                    manager,
                    transactionDetails
                )
                const debitAccount = await this.debitAccount(
                    debitUserId,
                    amount,
                    manager,
                    transactionDetails
                )
                return debitAccount
            }
        )
        return account
    }

    async withdraw(
        userId: string,
        beneficiaryId: string,
        amount: number
    ): Promise<{}> {
        const beneficiary = await this.beneficiaryRepository.findOneWithUserId(
            userId,
            beneficiaryId
        )
        if (!beneficiary) {
            throw new NotFoundError('Beneficiary not found')
        }

        const pst_strat = getPaymentStrategy('PAYSTACK')
        this.paymentService.setStrategy(pst_strat)
        const result = await this.paymentService.payout({
            bank_code: beneficiary.bank_code,
            bank_account: beneficiary.bank_account,
            amount,
        })
        if (!result.success) {
            throw new APIError('Can not process withdrawals currently', 500)
        }
        const accountRepository = this
            .accountRepository as unknown as AccountRepository

        const account = await accountRepository.manager.transaction(
            async (manager) => {
                const transactionDetails = {
                    ext_reference: result.data.reference,
                    category: TransactionCategory.WITHDRAWAL,
                    narration: `Withdrawal to ${beneficiary.account_name}`,
                }
                const account = await this.debitAccount(
                    userId,
                    amount,
                    manager,
                    transactionDetails
                )
                return account
            }
        )
        return account
    }
}
