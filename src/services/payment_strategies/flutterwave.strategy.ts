import axios from 'axios'
import { PayoutDto, VerifyAccountDto } from '../../utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import { IPaymentStrategy } from '../../utils/interfaces/services.interfaces'

export default class FlutterwaveStrategy implements IPaymentStrategy {
    private client
    constructor(flw_secret: string) {
        this.client = axios.create({
            baseURL: 'https://api.flutterwave.com/v3',
            headers: {
                Authorization: 'Bearer ' + flw_secret,
            },
        })
    }
    async chargeWithTransfer(bankTransferDto: BankTransferDto): Promise<{
        success: boolean
        data: {}
    }> {
        try {
            const result = await this.client.post(
                '/charges?type=bank_transfer',
                {
                    email: bankTransferDto.email,
                    amount: bankTransferDto.amount,
                    tx_ref: bankTransferDto.reference,
                    currency: 'NGN',
                    is_permanent: 'false',
                }
            )
            const {
                transfer_account: bank_account,
                transfer_bank: bank_name,
                transfer_amount: amount,
            } = result.data.meta.authorization
            const payload = {
                success: true,
                data: {
                    bank_account,
                    bank_name,
                    amount,
                },
            }
            return payload
        } catch (err) {
            console.log('err', err)
            return { success: false, data: {} }
        }
    }

    async verifyAccount(
        verifyAccountDto: VerifyAccountDto
    ): Promise<{ success: boolean; data: {} }> {
        return { success: false, data: {} }
    }

    async payout(payoutDto: PayoutDto): Promise<{
        success: boolean
        data: {
            reference: string | null
        }
    }> {
        return { success: false, data: { reference: null } }
    }
}
