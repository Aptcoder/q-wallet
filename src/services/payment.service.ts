import axios from 'axios'
import config from 'config'
import { PayoutDto, VerifyAccountDto } from 'src/utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../utils/dtos/account.dto'
import {
    IPaymentService,
    IPaymentStrategy,
} from '../utils/interfaces/services.interfaces'

export default class PaymentService implements IPaymentService {
    paymentStategy: any
    constructor(private paymentStrategy?: IPaymentStrategy) {
        this.paymentStategy = paymentStrategy
    }

    private checkForStrategy() {
        if (!this.paymentStategy) {
            throw new Error('A strategy is required for the payment service')
        }
    }

    setStrategy(strategy: IPaymentStrategy) {
        this.paymentStategy = strategy
    }

    async chargeWithTransfer(bankTransferDto: BankTransferDto): Promise<{
        success: boolean
        data: {}
    }> {
        this.checkForStrategy()
        return this.paymentStategy.chargeWithTransfer(bankTransferDto)
    }

    async verifyAccount(
        verifyAccountDto: VerifyAccountDto
    ): Promise<{ success: boolean; data: {} }> {
        this.checkForStrategy()
        return this.paymentStategy.verifyAccount(verifyAccountDto)
    }

    async payout(payoutDto: PayoutDto): Promise<{
        success: boolean
        data: {
            reference: string | null
        }
    }> {
        this.checkForStrategy()
        return this.paymentStategy.payout(payoutDto)
    }
}
