import { IBeneficiaryService } from '../../utils/interfaces/services.interfaces'
import { reqWithUser } from '../../utils/types'
import BeneficiaryController from '../beneficiary.controller'
import { Response } from 'express'
import { VerifyAccountDto } from 'src/utils/dtos/beneficiary.dto'

describe('Beneficiary controller', () => {
    const mockBeneficiaryService: IBeneficiaryService = {
        createBeneficiary(userId: string, verifyAccountDto: VerifyAccountDto) {
            return Promise.resolve({})
        },
    }

    const beneficiaryController = BeneficiaryController(mockBeneficiaryService)
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

    it('Should call createBeneficiaryy on service when create', async () => {
        const createBeneficiarySpy = jest.spyOn(
            mockBeneficiaryService,
            'createBeneficiary'
        )
        await beneficiaryController.create(mockReq as reqWithUser, mockRes)
        expect(createBeneficiarySpy).toHaveBeenCalled()
    })

    it('should res with 201 if createBeneficiary sucessful', async () => {
        const createBeneficiarySpy = jest.spyOn(
            mockBeneficiaryService,
            'createBeneficiary'
        )
        await beneficiaryController.create(mockReq as reqWithUser, mockRes)
        expect(createBeneficiarySpy).toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(mockRes.send).toHaveBeenCalled()
    })
})
