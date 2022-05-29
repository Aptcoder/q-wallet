import { VerifyAccountDto } from '../../utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../../utils/dtos/account.dto'
import {
    IAccountService,
    IBeneficiaryService,
    IPaymentService,
} from '../../utils/interfaces/services.interfaces'
import { EntityManager } from 'typeorm'
import { TransactionCategory } from '../../entities/transaction.entity'
import Account from '../../entities/account.entity'

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

export const mockAccountService: IAccountService = {
    getBalance(email: string) {
        return Promise.resolve(2)
    },

    withdraw() {
        return Promise.resolve({})
    },

    fundWithTransfer(bankTransferDto: BankTransferDto) {
        return Promise.resolve({
            bank_account: '0816352728',
            bank_name: 'WEMA BANK',
            account_name: 'Q wallet',
        })
    },

    creditAccount(
        userId: string,
        creditAccount: number,
        manager: EntityManager,
        transactionDetails?: {
            narration: string
            category: TransactionCategory
        }
    ) {
        return Promise.resolve(new Account())
    },
    debitAccount(
        userId: string,
        creditAccount: number,
        manager: EntityManager,
        transactionDetails?: {
            narration: string
            category: TransactionCategory
        }
    ) {
        return Promise.resolve(new Account())
    },
    transfer(
        creditUserId: string,
        debitUserId: string,
        amount: number,
        narration: string
    ) {
        return Promise.resolve(new Account())
    },
}
