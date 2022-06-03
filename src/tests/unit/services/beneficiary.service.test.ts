import { APIError, ConflictError } from '../../../utils/errors'
import { IBeneficiaryService } from '../../../utils/interfaces/services.interfaces'
import BeneficiaryService from '../../../services/beneficiary.service'
import { mockBeneficiaryRepository } from '../../mocks/repo.mocks'
import { paymentServiceMock } from '../../mocks/service.mocks'

describe('Beneficiary service', () => {
    let beneficiaryService: IBeneficiaryService

    beforeEach(() => {
        beneficiaryService = new BeneficiaryService(
            mockBeneficiaryRepository,
            paymentServiceMock
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    it('Should check if beneficiary exists', async () => {
        const findOneWithUserIdAndAccountSpy = jest.spyOn(
            mockBeneficiaryRepository,
            'findOneWithUserIdAndAccount'
        )

        await beneficiaryService.createBeneficiary('2', {
            bank_account: '018736316',
            bank_code: '044',
        })

        expect(findOneWithUserIdAndAccountSpy).toHaveBeenCalled()
    })

    it('Should throw error if beneficiary exists', async () => {
        const findOneWithUserIdAndAccountSpy = jest
            .spyOn(mockBeneficiaryRepository, 'findOneWithUserIdAndAccount')
            .mockResolvedValue({
                account_name: 'Sample name',
                bank_account: '832932727329',
                bank_code: '998',
            })
        const verifyAccountSpy = jest.spyOn(paymentServiceMock, 'verifyAccount')

        expect(async () => {
            await beneficiaryService.createBeneficiary('2', {
                bank_account: '018736316',
                bank_code: '044',
            })
        }).rejects.toBeInstanceOf(ConflictError)
        expect(findOneWithUserIdAndAccountSpy).toHaveBeenCalled()
        expect(verifyAccountSpy).not.toHaveBeenCalled()
    })

    it('Should call verify account payment service', async () => {
        const verifyAccountSpy = jest.spyOn(paymentServiceMock, 'verifyAccount')
        const createAndSaveSpy = jest.spyOn(
            mockBeneficiaryRepository,
            'createAndSave'
        )
        const result = await beneficiaryService.createBeneficiary('2', {
            bank_account: '018736316',
            bank_code: '044',
        })
        expect(verifyAccountSpy).toHaveBeenCalledTimes(1)
        expect(createAndSaveSpy).toHaveBeenCalled()
    })

    it('Should throw error if payment service verification is not successful', async () => {
        const verifyAccountSpy = jest
            .spyOn(paymentServiceMock, 'verifyAccount')
            .mockImplementation(() =>
                Promise.resolve({ success: false, data: {} })
            )
        const createAndSaveSpy = jest.spyOn(
            mockBeneficiaryRepository,
            'createAndSave'
        )
        expect(async () => {
            const result = await beneficiaryService.createBeneficiary('2', {
                bank_account: '018736316',
                bank_code: '044',
            })
        }).rejects.toBeInstanceOf(APIError)
    })

    it('Should fetch beneficiaries using repo by userId', async () => {
        const findByUserIdSpy = jest.spyOn(
            mockBeneficiaryRepository,
            'findByUserId'
        )
        const result = await beneficiaryService.getBeneficiaries('2')

        expect(findByUserIdSpy).toHaveBeenCalledWith('2')
    })
})
