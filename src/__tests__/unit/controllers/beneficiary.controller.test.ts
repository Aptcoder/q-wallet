import { reqWithUser } from '../../../utils/types'
import BeneficiaryController from '../../../controllers/beneficiary.controller'
import { mockBeneficiaryService } from '../../mocks/service.mocks'
import { mockReq, mockRes } from '../../mocks/util.mocks'

describe('Beneficiary controller', () => {
    const beneficiaryController = BeneficiaryController(mockBeneficiaryService)

    afterEach(() => {
        jest.clearAllMocks()
    })

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

    it('Should call service function to get all beneficiaries', async () => {
        const getBeneficiariesSpy = jest.spyOn(
            mockBeneficiaryService,
            'getBeneficiaries'
        )

        await beneficiaryController.getAll(mockReq as reqWithUser, mockRes)
        expect(getBeneficiariesSpy).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalled()
        expect(mockRes.send).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'success',
                message: 'Beneficiaries',
                data: expect.objectContaining({
                    beneficiaries: expect.any(Array),
                }),
            })
        )
    })
})
