import exp from 'constants'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import { EntityManager } from 'typeorm'
import Account from '../../entities/account.entity'
import Transaction, {
    TransactionCategory,
} from '../../entities/transaction.entity'
import { ConflictError, NotFoundError } from '../../utils/errors'
import {
    IAccountRepository,
    ITransactionRepository,
} from '../../utils/interfaces/repos.interfaces'
import {
    IAccountService,
    IPaymentService,
} from '../../utils/interfaces/services.interfaces'
import AccountService from '../account.services'

describe('Account service', () => {
    it('A + B', () => {
        expect(1 + 1).toBe(2)
    })

    let accountService: IAccountService

    const account = new Account()

    const paymentServiceMock: IPaymentService = {
        chargeWithTransfer(bankTransferDto: BankTransferDto) {
            return Promise.resolve({
                success: true,
                data: {},
            })
        },
    }
    const mockAccountRepository: IAccountRepository = {
        findOne({}) {
            return Promise.resolve(account)
        },
        update({}) {},
        findByUserId(userId: string) {
            return Promise.resolve(account)
        },
        updateBalance(account, amount, inc): Promise<Account> {
            return Promise.resolve(account)
        },
    }

    const transaction = new Transaction()
    const mockTransactionRepository: ITransactionRepository = {
        createAndSave({}) {
            return Promise.resolve(transaction)
        },
    }

    afterEach(() => {
        accountService = new AccountService(
            mockAccountRepository,
            mockTransactionRepository,
            paymentServiceMock
        )

        jest.clearAllMocks()
    })

    it('Should get balance fromm repo', async () => {
        const findOneSpy = jest.spyOn(mockAccountRepository, 'findOne')
        await accountService.getBalance('sample')

        expect(findOneSpy).toHaveBeenCalled()
        expect(findOneSpy).toHaveBeenCalledWith({
            where: {
                userId: 'sample',
            },
        })
    })

    it('SHould get balance fromm repo', async () => {
        const findOneSpy = jest
            .spyOn(mockAccountRepository, 'findOne')
            .mockImplementation(() => Promise.resolve(undefined))
        try {
            await accountService.getBalance('sample')
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundError)
            expect(findOneSpy).toHaveBeenCalled()
        }
    })

    it('Should throw account not found if not found in credit account function', async () => {
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(undefined))
        try {
            const manager = {} as EntityManager

            await accountService.creditAccount('sample', 2, manager, {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            })
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundError)
            expect(findUserByIdSpy).toHaveBeenCalled()
        }
    })

    it('Should credit account', async () => {
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(account))

        const updateBalanceSpy = jest.spyOn(
            mockAccountRepository,
            'updateBalance'
        )
        const createAndSaveSpy = jest.spyOn(
            mockTransactionRepository,
            'createAndSave'
        )

        const manager = {} as EntityManager

        const result = await accountService.creditAccount(
            'sampleId',
            2,
            manager,
            {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            }
        )
        expect(findUserByIdSpy).toHaveBeenCalled()
        expect(updateBalanceSpy).toHaveBeenCalled()
        expect(createAndSaveSpy).toHaveBeenCalled()
    })

    it('Should throw account not found if not found in debit account function', async () => {
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(undefined))
        try {
            const manager = {} as EntityManager

            await accountService.debitAccount('sample', 2, manager, {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            })
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundError)
            expect(findUserByIdSpy).toHaveBeenCalled()
        }
    })

    it('Should throw insuffience balance if balance less than amount debit account function', async () => {
        const account = new Account()
        account.balance = 500
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(account))
        try {
            const manager = {} as EntityManager

            await accountService.debitAccount('sample', 2000, manager, {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            })
        } catch (err) {
            expect(err).toBeInstanceOf(ConflictError)
            expect(findUserByIdSpy).toHaveBeenCalled()
        }
    })

    it('Should debit account', async () => {
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(account))

        const updateBalanceSpy = jest.spyOn(
            mockAccountRepository,
            'updateBalance'
        )
        const createAndSaveSpy = jest.spyOn(
            mockTransactionRepository,
            'createAndSave'
        )

        const manager = {} as EntityManager

        const result = await accountService.debitAccount(
            'sampleId',
            2,
            manager,
            {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            }
        )
        expect(findUserByIdSpy).toHaveBeenCalled()
        expect(updateBalanceSpy).toHaveBeenCalled()
        expect(createAndSaveSpy).toHaveBeenCalled()
    })

    it('Should call charge with transfer on payment service', async () => {
        const paymentServiceChargeWithCardSpy = jest.spyOn(
            paymentServiceMock,
            'chargeWithTransfer'
        )
        const result = await accountService.fundWithTransfer({
            email: 'sample@user.com',
            amount: '5000',
        })

        expect(paymentServiceChargeWithCardSpy).toHaveBeenCalled()
        expect(paymentServiceChargeWithCardSpy).toHaveBeenCalledWith({
            email: 'sample@user.com',
            amount: '5000',
            reference: expect.any(String),
        })
    })
})
