import { reqWithUser } from '../../../utils/types'
import { IAccountService } from '../../../utils/interfaces/services.interfaces'
import AccountController from '../../../controllers/account.controller'
import { Response } from 'express'
import Account from '../../../entities/account.entity'
import { TransactionCategory } from '../../../entities/transaction.entity'
import { EntityManager } from 'typeorm'
import { BankTransferDto } from '../../../utils/dtos/account.dto'

describe('Account controller', () => {
    const mockAccountService: IAccountService = {
        getBalance(email: string) {
            return Promise.resolve(2)
        },

        withdraw() {
            return Promise.resolve({})
        },

        fundWithTransfer(bankTransferDto: BankTransferDto) {
            return Promise.resolve({
                bank_account: '0816352728',
                bank_name: 'WEMA BANK',
                account_name: 'Q wallet',
            })
        },

        creditAccount(
            userId: string,
            creditAccount: number,
            manager: EntityManager,
            transactionDetails?: {
                narration: string
                category: TransactionCategory
            }
        ) {
            return Promise.resolve(new Account())
        },
        debitAccount(
            userId: string,
            creditAccount: number,
            manager: EntityManager,
            transactionDetails?: {
                narration: string
                category: TransactionCategory
            }
        ) {
            return Promise.resolve(new Account())
        },
        transfer(
            creditUserId: string,
            debitUserId: string,
            amount: number,
            narration: string
        ) {
            return Promise.resolve(new Account())
        },
    }

    let accountController = AccountController(mockAccountService)

    const mockReq = {
        user: {
            email: 'sample@gmail.com',
        },
    } as unknown

    const mockRes = {
        status: jest.fn(() => {
            return mockRes
        }),
        send: jest.fn(),
    } as unknown as Response

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should call get balance account service function', async () => {
        const balanceSpy = jest.spyOn(mockAccountService, 'getBalance')
        await accountController.getBalance(mockReq as reqWithUser, mockRes)
        expect(balanceSpy).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
            })
        )
    })

    it('Should call get balance account service function', async () => {
        const balanceSpy = jest
            .spyOn(mockAccountService, 'getBalance')
            .mockImplementation(() => {
                throw new Error()
            })
        await accountController.getBalance(mockReq as reqWithUser, mockRes)
        expect(balanceSpy).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.any(String),
            })
        )
        expect(mockRes.status).toBeCalledWith(500)
    })

    it('Should call fund_with_transfer on service', async () => {
        const fundWithTransferSpy = jest.spyOn(
            mockAccountService,
            'fundWithTransfer'
        )
        const fundWithTransferReq = {
            ...(mockReq as object),
            query: {
                method: 'transfer',
            },
            body: {
                amount: 123443,
            },
        } as unknown
        await accountController.fundAccount(
            fundWithTransferReq as reqWithUser,
            mockRes
        )

        expect(fundWithTransferSpy).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalled()
    })

    it('Should throw error if not method is passed when funding account', async () => {
        const notFundWithTransferSpy = jest.spyOn(
            mockAccountService,
            'fundWithTransfer'
        )
        const fundReq = {
            ...(mockReq as object),
            query: {},
            body: {
                amount: 123443,
            },
        } as unknown
        await accountController.fundAccount(fundReq as reqWithUser, mockRes)

        expect(notFundWithTransferSpy).not.toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'failed',
            })
        )
    })
})
