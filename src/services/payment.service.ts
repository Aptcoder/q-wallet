import axios from 'axios'
import config from 'config'
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
}
