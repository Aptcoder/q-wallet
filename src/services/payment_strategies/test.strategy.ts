import axios from 'axios'
import { PayoutDto, VerifyAccountDto } from '../../utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import { IPaymentStrategy } from '../../utils/interfaces/services.interfaces'
import config from 'config'

export default class TestStrategy implements IPaymentStrategy {
    async chargeWithTransfer(bankTransferDto: BankTransferDto): Promise<{
        success: boolean
        data: {}
    }> {
        return { success: true, data: {} }
    }

    async verifyAccount(
        verifyAccountDto: VerifyAccountDto
    ): Promise<{ success: boolean; data: {} }> {
        return {
            success: true,
            data: {
                account_name: 'Sample name',
            },
        }
    }

    async payout(payoutDto: PayoutDto): Promise<{
        success: boolean
        data: {
            reference: string | null
        }
    }> {
        return {
            success: true,
            data: {
                reference: 'randomreference',
            },
        }
    }
}
