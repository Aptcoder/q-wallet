import config from 'config'
import { getPaymentStrategy } from '../utils/helpers'
import { VerifyAccountDto } from '../utils/dtos/beneficiary.dto'
import { APIError, ConflictError } from '../utils/errors'
import { IBeneficiaryRepository } from '../utils/interfaces/repos.interfaces'
import {
    IBeneficiaryService,
    IPaymentService,
} from '../utils/interfaces/services.interfaces'
import PaystackStrategy from './payment_strategies/paystack.strategy'

export default class BeneficiaryService implements IBeneficiaryService {
    constructor(
        private beneficiaryRepository: IBeneficiaryRepository,
        private paymentService: IPaymentService
    ) {
        ;(this.beneficiaryRepository = beneficiaryRepository),
            (this.paymentService = paymentService)
    }

    async createBeneficiary(
        userId: string,
        verifyAccountDto: VerifyAccountDto
    ): Promise<{}> {
        const oldBeneficiary =
            await this.beneficiaryRepository.findOneWithUserIdAndAccount(
                userId,
                verifyAccountDto.bank_account
            )
        if (oldBeneficiary) {
            throw new ConflictError('Beneficiary already exists')
        }
        const pst_strat = getPaymentStrategy('PAYSTACK')
        this.paymentService.setStrategy(pst_strat)
        const result = await this.paymentService.verifyAccount(verifyAccountDto)
        if (!result.success) {
            throw new APIError('Could not verify account details', 400)
        }

        const beneficiary = await this.beneficiaryRepository.createAndSave({
            ...verifyAccountDto,
            userId,
            account_name: result.data.account_name,
        })
        return beneficiary
    }

    async getBeneficiaries(userId: string): Promise<any[]> {
        const result = await this.beneficiaryRepository.findByUserId(userId)
        return result
    }
}
