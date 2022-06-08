import { VerifyAccountDto } from '../../src/utils/dtos/beneficiary.dto'
import { BankTransferDto } from '../../src/utils/dtos/account.dto'
import {
    IAccountService,
    IBeneficiaryService,
    IPaymentService,
} from '../../src/utils/interfaces/services.interfaces'
import { EntityManager } from 'typeorm'
import { TransactionCategory } from '../../src/entities/transaction.entity'
import Account from '../../src/entities/account.entity'

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
            data: {
                reference: null,
            },
        })
    },
    verifyAccount() {
        return Promise.resolve({ success: true, data: {} })
    },

    setStrategy() {},
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
