import { APIError, ConflictError, NotFoundError } from '../../utils/errors'
import { IBeneficiaryRepository } from '../../utils/interfaces/repos.interfaces'
import {
    IBeneficiaryService,
    IPaymentService,
} from '../../utils/interfaces/services.interfaces'
import UserService from '../user.service'
import BeneficiaryService from '../beneficiary.service'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import {
    CreateBeneficiaryDto,
    VerifyAccountDto,
} from 'src/utils/dtos/beneficiary.dto'

describe('Beneficiary service', () => {
    let beneficiaryService: IBeneficiaryService
    const mockBeneficiaryRepository: IBeneficiaryRepository = {
        createAndSave(createBeneficiaryDto: CreateBeneficiaryDto) {
            return Promise.resolve({})
        },
    }

    const paymentServiceMock: IPaymentService = {
        chargeWithTransfer(bankTransferDto: BankTransferDto) {
            return Promise.resolve({
                success: true,
                data: {},
            })
        },
        verifyAccount(verifyAccountDto: VerifyAccountDto) {
            return Promise.resolve({ success: true, data: {} })
        },
    }

    beforeEach(() => {
        beneficiaryService = new BeneficiaryService(
            mockBeneficiaryRepository,
            paymentServiceMock
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
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
        expect(verifyAccountSpy).toHaveBeenCalled()
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
        try {
            const result = await beneficiaryService.createBeneficiary('2', {
                bank_account: '018736316',
                bank_code: '044',
            })
        } catch (err) {
            expect(err).toBeInstanceOf(APIError)
            expect(verifyAccountSpy).toHaveBeenCalled()
            expect(createAndSaveSpy).not.toHaveBeenCalled()
        }
    })
})
