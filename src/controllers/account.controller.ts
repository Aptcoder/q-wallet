/* eslint-disable camelcase */
import { Response } from 'express'
import { APIError } from '../utils/errors'
import { IAccountService } from '../utils/interfaces/services.interfaces'
import { processError } from '../utils/helpers'
import { reqWithUser } from '../utils/types'

export default (accountService: IAccountService) => ({
    async getBalance(
        req: reqWithUser,
        res: Response
    ): Promise<void | Response> {
        try {
            const { id: userId } = req.user
            const balance = await accountService.getBalance(userId)
            return res.send({
                message: 'Balance',
                status: 'success',
                data: {
                    balance,
                },
            })
        } catch (err: any) {
            return processError(res, err)
        }
    },

    async fundAccount(req: reqWithUser, res: Response) {
        try {
            const { id: userId, email } = req.user
            const method = req.query.method
            if (method == 'transfer') {
                const { amount } = req.body
                const result = await accountService.fundWithTransfer({
                    amount,
                    email,
                })
                return res.send({
                    message: 'Transfer initiated. Make transfer to details',
                    status: 'success',
                    data: {
                        ...result,
                    },
                })
            }

            throw new APIError('Invalid fund method', 400)
        } catch (err) {
            return processError(res, err)
        }
    },

    async withdraw(req: reqWithUser, res: Response) {
        try {
            const { id: userId } = req.user
            const { beneficiary, amount } = req.body
            const result = await accountService.withdraw(
                userId,
                beneficiary,
                amount
            )

            return res.send({
                message:
                    'Withdrawal initiated. Should take a couple of minutes',
                status: 'success',
                data: {},
            })
        } catch (err) {
            return processError(res, err)
        }
    },

    async makeTransfer(
        req: reqWithUser,
        res: Response
    ): Promise<void | Response> {
        try {
            const { userId, amount, narration } = req.body
            const { id: debitUserId } = req.user
            const result = await accountService.transfer(
                userId,
                debitUserId,
                amount,
                narration
            )

            return res.send({
                message: 'Transfer successful',
                data: {
                    balance: result.balance,
                },
            })
        } catch (err: any) {
            return processError(res, err)
        }
    },
})
