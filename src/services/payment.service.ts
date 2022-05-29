import axios from 'axios'
import config from 'config'
import { PayoutDto, VerifyAccountDto } from 'src/utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../utils/dtos/account.dto'
import { IPaymentService } from '../utils/interfaces/services.interfaces'

export default class PaymentService implements IPaymentService {
    paymentStategy: any
    constructor(private paymentStrategy?: any) {
        this.paymentStategy = paymentStrategy
    }

    async chargeWithTransfer(bankTransferDto: BankTransferDto): Promise<{
        success: boolean
        data: {}
    }> {
        try {
            const result = await axios.post(
                'https://api.flutterwave.com/v3/charges?type=bank_transfer',
                {
                    email: bankTransferDto.email,
                    amount: bankTransferDto.amount,
                    tx_ref: bankTransferDto.reference,
                    currency: 'NGN',
                    is_permanent: 'false',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + config.get('flw_secret'),
                    },
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
        try {
            const result = await axios.get(
                `https://api.paystack.co/bank/resolve?account_number=${verifyAccountDto.bank_account}&bank_code=${verifyAccountDto.bank_code}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + config.get('pstk_secret'),
                    },
                }
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

    async payout(payoutDto: PayoutDto): Promise<{ success: boolean }> {
        try {
            const recepientResult = await axios.post(
                'https://api.paystack.co/transferrecipient',
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
                'https://api.paystack.co/transfer',
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

            console.log(transferResult)
            return {
                success: true,
            }
        } catch (err) {
            console.log(err)
            return { success: false }
        }
    }
}
