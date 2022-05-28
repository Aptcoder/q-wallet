import { getConnection, EntityManager } from 'typeorm'
import { randomUUID } from 'crypto'
import {
    IAccountRepository,
    IBeneficiaryRepository,
    ITransactionRepository,
} from 'src/utils/interfaces/repos.interfaces'
import Account from '../entities/account.entity'
import User from '../entities/user.entity'
import Transaction, {
    TransactionType,
    TransactionCategory,
} from '../entities/transaction.entity'
import {
    IAccountService,
    IPaymentService,
} from '../utils/interfaces/services.interfaces'
import { APIError, ConflictError, NotFoundError } from '../utils/errors'
import AccountRepository from '../repositories/account.repository'
import { BankTransferDto } from '../utils/dtos/account.dto'

export default class AccountService implements IAccountService {
    constructor(
        private accountRepository: IAccountRepository,
        private transactionRepository: ITransactionRepository,
        private paymentService: IPaymentService,
        private beneficiaryRepository: IBeneficiaryRepository
    ) {
        this.accountRepository = accountRepository
        this.transactionRepository = transactionRepository
        this.paymentService = paymentService
        this.beneficiaryRepository = beneficiaryRepository
    }

    // private static processCardPaymentResult(result: any) {
    //   if (result.status !== 'success') {
    //     return {
    //       creditAccount: false,
    //       success: false,
    //       nextAction: 'Could not charge card',
    //       status: 'FAILED'
    //     };
    //   }

    //   // is the next stage to submit otp;
    //   if (result.meta) {
    //     const { authorization } = result.meta;
    //     const { mode } = authorization;
    //     console.log('autho', mode);
    //     if (mode === 'otp') {
    //       return {
    //         creditAccount: false,
    //         success: true,
    //         nextAction: 'Submit OTP',
    //         status: 'SUBMIT_OTP'
    //       };
    //     }
    //     if (mode === 'pin') {
    //       return {
    //         creditAccount: false,
    //         success: true,
    //         nextAction: 'Submit PIN',
    //         status: 'PIN_REQUIRED'
    //       };
    //     }
    //   }

    //   if (result.data) {
    //     const { status } = result.data;
    //     if (status === 'successful') {
    //       return {
    //         creditAccount: true,
    //         success: true,
    //         nextAction: 'Credit Account',
    //         status: 'COMPLETED'
    //       };
    //     }
    //   }

    //   return {
    //     creditAccount: false,
    //     success: false,
    //     nextAction: 'Could not charge card',
    //     status: 'FAILED'
    //   };
    // }

    public async getBalance(userId: string) {
        const account: Account | undefined =
            await this.accountRepository.findOne({
                where: {
                    userId,
                },
            })
        if (!account) {
            throw new NotFoundError('Account not found')
        }
        return account.balance
    }

    public async fundWithTransfer(
        bankTransferDto: BankTransferDto
    ): Promise<{}> {
        const tx_ref = randomUUID()
        const result = await this.paymentService.chargeWithTransfer({
            reference: tx_ref,
            email: bankTransferDto.email,
            amount: bankTransferDto.amount,
        })

        if (!result.success) {
            throw new APIError('Could not intiate transfer', 500)
        }
        return result.data
    }

    // public async initiateCardFunding(
    //   userEmail: string,
    //   card: {
    //     cvv: string,
    //     card_number: string,
    //     expiry_month: string,
    //     pin: string,
    //     expiry_year: string
    //   },
    //   amount: number
    // ) {
    //   const user = await this.connection.getRepository(User).findOne({
    //     where: {
    //       email: userEmail
    //     }
    //   });

    //   if (!user) {
    //     throw new ServiceError({ status: 404, message: 'User not found ' });
    //   }

    //   const account = await this.connection.getRepository(Account).findOne({
    //     where: {
    //       user: user.id
    //     }
    //   });

    //   if (!account) {
    //     throw new ServiceError({ status: 404, message: 'Account not found ' });
    //   }
    //   const randRef = randomUUID();
    //   const payload = {
    //     ...card,
    //     tx_ref: randRef,
    //     fullname: `${user.firstName} ${user.lastName}`,
    //     email: user.email,
    //     amount
    //   };
    //   const result = await paymentService.initiateCardPayment(payload);
    //   const processedResult = AccountService.processCardPaymentResult(result);
    //   if (!processedResult.success) {
    //     throw new ServiceError({ status: 400, message: processedResult.nextAction as string });
    //   }

    //   if (processedResult.nextAction === 'Submit PIN') {
    //     return {
    //       message: 'Submit card pin to continue',
    //       status: processedResult.status
    //     };
    //   }

    //   const transaction = new Transaction();
    //   transaction.category = TransactionCategory.CARD_FUNDING;
    //   transaction.narration = 'CARDFD_';
    //   transaction.amount = amount;
    //   transaction.balance_before = account.balance;
    //   transaction.balance_after = account.balance + Number(amount);
    //   transaction.account = account;
    //   transaction.type = TransactionType.CREDIT;
    //   transaction.meta_data = JSON.stringify({
    //     response: result.message
    //   });
    //   transaction.reference = randRef;
    //   transaction.ext_reference = (result.data ? result.data.flw_ref : null) as string;
    //   transaction.last_ext_response = (result.data ? result.data.status : 'pending') as string;

    //   await this.connection.getRepository(Transaction).save(transaction);

    //   return {
    //     message: processedResult.nextAction,
    //     status: processedResult.status,
    //     data: {
    //       transaction
    //     }
    //   };
    // }

    // public async validateFunding(txRef: string, otp: string, user: any) {
    //   const { accountId } = user;
    //   const transaction = await this.connection.getRepository(Transaction).findOne({
    //     where: {
    //       reference: txRef,
    //       account: accountId
    //     },
    //     relations: ['account']
    //   });

    //   if (!transaction) {
    //     throw new ServiceError({ status: 404, message: 'Transaction not found ' });
    //   }
    //   const result = await paymentService.validateCharge(transaction.ext_reference, otp);
    //   if (result.status !== 'success') {
    //     throw new ServiceError({ status: 400, message: 'Could not validate charge' });
    //   }

    //   await this.connection.getRepository(Transaction).update({
    //     reference: transaction.reference
    //   }, {
    //     last_ext_response: result.data.status as string
    //   });

    //   await this.connection.transaction(async (manager) => {
    //     await manager.update(Transaction, {
    //       reference: transaction.reference
    //     }, {
    //       last_ext_response: result.data.status as string
    //     });

    //     await AccountService.creditAccount(
    //       transaction.account,
    //       transaction.amount,
    //       manager
    //     );
    //   });

    //   return {
    //     message: 'Charge completed',
    //     data: {
    //       transaction
    //     }
    //   };
    // }

    public async creditAccount(
        userId: string,
        creditAmount: number,
        manager: EntityManager,
        transactionDetails: {
            narration: string
            category: TransactionCategory
            ext_reference?: string
        }
    ) {
        let account = await this.accountRepository.findByUserId(
            userId,
            manager,
            true
        )
        if (!account) {
            throw new NotFoundError('Credit account not found')
        }
        const oldBalance = account.balance

        account = await this.accountRepository.updateBalance(
            account,
            creditAmount,
            'inc',
            manager
        )
        const transactionData = {
            amount: creditAmount,
            type: TransactionType.CREDIT,
            accountId: account.id,
            meta_data: transactionDetails.narration,
            balance_after: account.balance,
            balance_before: oldBalance,
            ...transactionDetails,
        }
        await this.transactionRepository.createAndSave(transactionData, manager)

        return account
    }

    public async debitAccount(
        userId: string,
        debitAmount: number,
        manager: EntityManager,
        transactionDetails: { narration: string; category: TransactionCategory }
    ) {
        let account = await this.accountRepository.findByUserId(
            userId,
            manager,
            true
        )

        if (!account) {
            throw new NotFoundError('Debit account not found')
        }

        if (account.balance < debitAmount) {
            throw new ConflictError('Insufficient balance')
        }

        const oldBalance = account.balance

        account = await this.accountRepository.updateBalance(
            account,
            debitAmount,
            'dec',
            manager
        )
        const transactionData = {
            amount: debitAmount,
            type: TransactionType.DEBIT,
            accountId: account.id,
            meta_data: transactionDetails.narration,
            balance_after: account.balance,
            balance_before: oldBalance,
            ...transactionDetails,
        }
        await this.transactionRepository.createAndSave(transactionData, manager)

        return account
    }

    public async transfer(
        creditUserId: string,
        debitUserId: string,
        amount: number,
        narration: string
    ) {
        if (amount < 50) {
            throw new APIError('Amount can not be less than 50', 400)
        }
        if (creditUserId == debitUserId) {
            throw new APIError(
                'Debit user and credit user can not be the same',
                400
            )
        }
        const accountRepository = this.accountRepository as AccountRepository

        const account = await accountRepository.manager.transaction(
            async (manager) => {
                const transactionDetails = {
                    narration: narration ? `INT_TRF_${narration}` : 'INT_TEF',
                    category: TransactionCategory.WALLET_TRANSFER,
                }
                const creditAccount = await this.creditAccount(
                    creditUserId,
                    amount,
                    manager,
                    transactionDetails
                )
                const debitAccount = await this.debitAccount(
                    debitUserId,
                    amount,
                    manager,
                    transactionDetails
                )
                return debitAccount
            }
        )
        return account
    }

    async withdraw(userId: string, beneficiaryId: string): Promise<{}> {
        const beneficiary = await this.beneficiaryRepository.findOneWithUserId(
            userId,
            beneficiaryId
        )
        if (!beneficiary) {
            throw new NotFoundError('Beneficiary not found')
        }

        const result = this.paymentService.payout({
            bank_code: beneficiary.bank_code,
            bank_account: beneficiary.bank_account,
        })
        return {}
    }
}
