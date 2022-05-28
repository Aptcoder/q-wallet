import { VerifyAccountDto } from '../../utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import {
    IBeneficiaryService,
    IPaymentService,
} from '../../utils/interfaces/services.interfaces'

export const paymentServiceMock: IPaymentService = {
    chargeWithTransfer(bankTransferDto: BankTransferDto) {
        return Promise.resolve({
            success: true,
            data: {},
        })
    },
    payout() {
        return Promise.resolve({
            success: true,
        })
    },
    verifyAccount() {
        return Promise.resolve({ success: true, data: {} })
    },
}

export const mockBeneficiaryService: IBeneficiaryService = {
    createBeneficiary(userId: string, verifyAccountDto: VerifyAccountDto) {
        return Promise.resolve({})
    },

    getBeneficiaries(userId: string) {
        return Promise.resolve([])
    },
}
