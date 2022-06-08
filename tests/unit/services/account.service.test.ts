import { EntityManager } from 'typeorm'
import Account from '../../../src/entities/account.entity'
import {
    APIError,
    ConflictError,
    NotFoundError,
} from '../../../src/utils/errors'
import { IAccountService } from '../../../src/utils/interfaces/services.interfaces'
import AccountService from '../../../src/services/account.services'
import {
    mockAccountRepository,
    mockBeneficiaryRepository,
    mockTransactionRepository,
} from '../../mocks/repo.mocks'
import { paymentServiceMock } from '../../mocks/service.mocks'
import { TransactionCategory } from '../../../src/entities/transaction.entity'

describe('Account service', () => {
    it('A + B', () => {
        expect(1 + 1).toBe(2)
    })

    let accountService: IAccountService
    const account = new Account()

    afterEach(() => {
        accountService = new AccountService(
            mockAccountRepository,
            mockTransactionRepository,
            paymentServiceMock,
            mockBeneficiaryRepository
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
        expect(async () => {
            await accountService.getBalance('sample')
        }).rejects.toBeInstanceOf(NotFoundError)
        expect(findOneSpy).toHaveBeenCalled()
    })

    it('Should throw account not found if not found in credit account function', async () => {
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(undefined))
        const manager = {} as EntityManager
        expect(async () => {
            await accountService.creditAccount('sample', 2, manager, {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            })
        }).rejects.toBeInstanceOf(NotFoundError)
        expect(findUserByIdSpy).toHaveBeenCalled()
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
        const manager = {} as EntityManager
        expect(async () => {
            await accountService.debitAccount('sample', 2, manager, {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            })
        }).rejects.toBeInstanceOf(NotFoundError)
        expect(findUserByIdSpy).toHaveBeenCalled()
    })

    it('Should throw insuffience balance if balance less than amount debit account function', async () => {
        const account = new Account()
        account.balance = 500
        const findUserByIdSpy = jest
            .spyOn(mockAccountRepository, 'findByUserId')
            .mockImplementation(() => Promise.resolve(account))
        const manager = {} as EntityManager
        expect(async () => {
            await accountService.debitAccount('sample', 2000, manager, {
                narration: 'Transfer test',
                category: TransactionCategory.WALLET_TRANSFER,
            })
        }).rejects.toBeInstanceOf(ConflictError)
        expect(findUserByIdSpy).toHaveBeenCalled()
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
        const paymentServiceChargeWithTransferSpy = jest.spyOn(
            paymentServiceMock,
            'chargeWithTransfer'
        )
        const result = await accountService.fundWithTransfer({
            email: 'sample@user.com',
            amount: '5000',
        })

        expect(paymentServiceChargeWithTransferSpy).toHaveBeenCalled()
        expect(paymentServiceChargeWithTransferSpy).toHaveBeenCalledWith({
            email: 'sample@user.com',
            amount: '5000',
            reference: expect.any(String),
        })
    })

    it('Should check for bene when withdraw', async () => {
        const findOneWithUserId = jest.spyOn(
            mockBeneficiaryRepository,
            'findOneWithUserId'
        )

        await accountService.withdraw('2', 'beneficiaryId', 5000)
        expect(findOneWithUserId).toHaveBeenCalled()
        expect(findOneWithUserId).toHaveBeenCalledWith('2', 'beneficiaryId')
    })

    it('Should check for bene when withdraw', async () => {
        const findOneWithUserId = jest.spyOn(
            mockBeneficiaryRepository,
            'findOneWithUserId'
        )

        await accountService.withdraw('2', 'beneficiaryId', 5000)
        expect(findOneWithUserId).toHaveBeenCalled()
        expect(findOneWithUserId).toHaveBeenCalledWith('2', 'beneficiaryId')
    })

    it('Should throw error if beneficiary not found when withdraw', async () => {
        const findOneWithUserId = jest
            .spyOn(mockBeneficiaryRepository, 'findOneWithUserId')
            .mockImplementation(() => Promise.resolve(undefined))
        expect(async () => {
            await accountService.withdraw('2', 'beneficiaryId', 5000)
        }).rejects.toBeInstanceOf(NotFoundError)

        expect(findOneWithUserId).toHaveBeenCalled()
        expect(findOneWithUserId).toHaveBeenCalledWith('2', 'beneficiaryId')
    })

    it('Should call payment service transfer on withdraw', async () => {
        const findOneWithUserId = jest
            .spyOn(mockBeneficiaryRepository, 'findOneWithUserId')
            .mockImplementation(() =>
                Promise.resolve({
                    bank_account: '083267322',
                    bank_code: '044',
                })
            )

        const payoutSpy = jest.spyOn(paymentServiceMock, 'payout')

        await accountService.withdraw('2', 'beneficiaryId', 5000)

        expect(payoutSpy).toBeCalled()
        expect(payoutSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                bank_account: '083267322',
                bank_code: '044',
            })
        )
    })

    it('Should throw error if payment service payout function return success false', async () => {
        const payoutSpy = jest
            .spyOn(paymentServiceMock, 'payout')
            .mockImplementation(() =>
                Promise.resolve({
                    success: false,
                    data: {
                        reference: null,
                    },
                })
            )
        expect(async () => {
            await accountService.withdraw('2', 'beneficiaryId', 5000)
        }).rejects.toBeInstanceOf(APIError)
    })

    it('Should debit user when withdraw function', async () => {
        const debitAccountSpy = jest.spyOn(accountService, 'debitAccount')
        const payoutSpy = jest
            .spyOn(paymentServiceMock, 'payout')
            .mockImplementation(() =>
                Promise.resolve({
                    success: true,
                    data: {
                        reference: null,
                    },
                })
            )

        await accountService.withdraw('2', 'bemeficiaryId', 5000)

        expect(debitAccountSpy).toHaveBeenCalled()
    })
})
