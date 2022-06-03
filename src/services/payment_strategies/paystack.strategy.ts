import axios from 'axios'
import { PayoutDto, VerifyAccountDto } from '../../utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import { IPaymentStrategy } from '../../utils/interfaces/services.interfaces'
import config from 'config'

export default class PaystackStrategy implements IPaymentStrategy {
    private client

    constructor(pstk_secret: string) {
        this.client = axios.create({
            baseURL: 'https://api.paystack.co/',
            headers: {
                Authorization: 'Bearer ' + pstk_secret,
            },
        })
    }

    async chargeWithTransfer(bankTransferDto: BankTransferDto): Promise<{
        success: boolean
        data: {}
    }> {
        return { success: false, data: {} }
    }

    async verifyAccount(
        verifyAccountDto: VerifyAccountDto
    ): Promise<{ success: boolean; data: {} }> {
        try {
            const result = await this.client.get(
                `bank/resolve?account_number=${verifyAccountDto.bank_account}&bank_code=${verifyAccountDto.bank_code}`
            )

            return {
                success: true,
                data: {
                    account_name: result.data.data.account_name,
                },
            }
        } catch (err) {
            console.log('err', err)
            return { success: false, data: {} }
        }
    }

    async payout(payoutDto: PayoutDto): Promise<{
        success: boolean
        data: {
            reference: string | null
        }
    }> {
        try {
            const recepientResult = await this.client.post(
                'transferrecipient',
                {
                    account_number: payoutDto.bank_account,
                    bank_code: payoutDto.bank_code,
                    type: 'nuban',
                    name: `${payoutDto.bank_code}-${payoutDto.bank_account}`,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + config.get('pstk_secret'),
                    },
                }
            )
            console.log(recepientResult)
            const transferResult = await axios.post(
                '/transfer',
                {
                    source: 'balance',
                    reason: 'Withdrawal from q-wallet',
                    amount: payoutDto.amount,
                    recipient: recepientResult.data.data.recipient_code,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + config.get('pstk_secret'),
                    },
                }
            )

            return {
                success: true,
                data: {
                    reference: transferResult.data.data.reference,
                },
            }
        } catch (err) {
            return {
                success: false,
                data: {
                    reference: null,
                },
            }
        }
    }
}
