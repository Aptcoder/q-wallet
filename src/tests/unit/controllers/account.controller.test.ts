import { reqWithUser } from '../../../utils/types'
import AccountController from '../../../controllers/account.controller'
import { Response } from 'express'
import { mockAccountService } from '../../../tests/mocks/service.mocks'
import { mockReq, mockRes } from '../../../tests/mocks/util.mocks'

describe('Account controller', () => {
    let accountController = AccountController(mockAccountService)

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

    it('Should call withdraw on account service on withdraw', async () => {
        const withDrawSpy = jest.spyOn(mockAccountService, 'withdraw')

        const withdrawReq = {
            ...(mockReq as object),
            query: {},
            body: {
                beneficiary: 'beneficiaryId',
                amount: 5000,
            },
        } as unknown

        await accountController.withdraw(withdrawReq as reqWithUser, mockRes)

        expect(withDrawSpy).toHaveBeenCalled()
        expect(withDrawSpy).toHaveBeenCalledWith('3', 'beneficiaryId', 5000)
    })
})
