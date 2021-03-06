import { processError } from '../utils/helpers'
import { reqWithUser } from '../utils/types'
import { Response } from 'express'
import { IBeneficiaryService } from '../utils/interfaces/services.interfaces'

export default (beneficiaryService: IBeneficiaryService) => ({
    async create(req: reqWithUser, res: Response) {
        try {
            const { id: userId } = req.user
            const beneficiary = await beneficiaryService.createBeneficiary(
                userId,
                {
                    ...req.body,
                }
            )
            return res.status(201).send({
                message: 'Beneficiary created',
                status: 'success',
                data: {
                    beneficiary,
                },
            })
        } catch (err) {
            return processError(res, err)
        }
    },

    async getAll(req: reqWithUser, res: Response) {
        try {
            const { id: userId } = req.user
            const beneficiaries = await beneficiaryService.getBeneficiaries(
                userId
            )
            return res.send({
                status: 'success',
                message: 'Beneficiaries',
                data: {
                    beneficiaries,
                },
            })
        } catch (err) {
            return processError(res, err)
        }
    },
})
