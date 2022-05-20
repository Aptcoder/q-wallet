import { reqWithUser } from '../../utils/types'
import { IAccountService } from '../../utils/interfaces/services.interfaces'
import AccountController from '../account.controller'
import { Response } from 'express'
import Account from '../../entities/account.entity'
import { TransactionCategory } from '../../entities/transaction.entity'
import { EntityManager } from 'typeorm'

describe('Account controller', () => {
    const mockAccountService: IAccountService = {
        getBalance(email: string) {
            return Promise.resolve(2)
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

    beforeEach(() => {})

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
})
